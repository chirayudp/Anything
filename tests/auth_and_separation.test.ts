import http from 'http';
import app from '../server/index';
import { Database } from '../server/db/database';
import { AuthService } from '../server/auth';
import { matchPath } from '../src/router';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[TEST FAILURE] ${message}`);
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('--- MONEY QUEST: AUTHENTICATION & ACCESS CONTROL TEST SUITE ---');
  console.log('============================================================\n');

  // Reset database to known seed state
  Database.resetForTesting();

  // Start test server on ephemeral port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  try {
    // -------------------------------------------------------------
    // Test Case 1: A student can log in and enter Money Quest
    // -------------------------------------------------------------
    console.log('Test 1: Student login & session generation...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arjun@student.in',
        password: 'Scholar@123',
        expectedRole: 'student',
      }),
    });

    assert(loginRes.status === 200, `Login status must be 200, got ${loginRes.status}`);
    const loginData = await loginRes.json();
    assert(!!loginData.token, 'Login must issue a JWT bearer token');
    assert(loginData.user.role === 'student', 'User role must be student');
    assert(loginData.user.studentId === 'STU-1042', 'Student ID must match STU-1042');
    assert(loginData.profile.walletBalance === 4200, 'Profile wallet must match seeded 4200');
    console.log('✓ Test 1 Passed: Student successfully logs in with valid JWT token & profile');

    const arjunToken = loginData.token;

    // -------------------------------------------------------------
    // Test Case 2: Complete a challenge, log out, log back in & resume saved progress
    // -------------------------------------------------------------
    console.log('Test 2: Complete challenge, log out, log in, resume progress...');
    
    // Simulate solving a new scenario and updating profile
    const updateRes = await fetch(`${baseUrl}/api/student/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${arjunToken}`,
      },
      body: JSON.stringify({
        completedScenarioIds: ['scenario_hostel_stipend', 'scenario_broken_phone', 'scenario_cycle_repair'],
        walletBalance: 4100,
        emergencyFund: 1200,
        totalScore: 380,
      }),
    });
    assert(updateRes.status === 200, 'Profile update must succeed');
    const updatedData = await updateRes.json();
    assert(
      updatedData.profile.completedScenarioIds.includes('scenario_cycle_repair'),
      'Must record new scenario scenario_cycle_repair'
    );

    // Simulate "Log out" by discarding client token, then logging back in
    const reLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arjun@student.in',
        password: 'Scholar@123',
      }),
    });
    const reLoginData = await reLoginRes.json();
    assert(reLoginData.profile.walletBalance === 4100, 'Resumed wallet balance must be 4100');
    assert(reLoginData.profile.emergencyFund === 1200, 'Resumed emergency fund must be 1200');
    assert(
      reLoginData.profile.completedScenarioIds.includes('scenario_cycle_repair'),
      'Resumed progress must preserve newly completed scenario'
    );
    console.log('✓ Test 2 Passed: Student saves progress, logs out, logs back in and resumes exact progress');

    // -------------------------------------------------------------
    // Test Case 3: Game events are stored against the correct student ID
    // -------------------------------------------------------------
    console.log('Test 3: Game event persistence associated with student ID...');
    const eventPayload = {
      eventId: `EVT-TEST-${Date.now()}`,
      eventType: 'decision',
      scenarioId: 'scenario_cycle_repair',
      choiceId: 'choice_repair_tube',
      tier: 'best',
      pillar: 'save',
      walletBefore: 4200,
      walletAfter: 4100,
      emergencyBefore: 1000,
      emergencyAfter: 1200,
      financialImpact: { walletDelta: -100, emergencyDelta: 200, stressDelta: -5, financialScoreDelta: 100 },
      isFailedState: false,
      isRetry: false,
      retryAttemptNumber: 1,
      feedbackShown: 'Repaired tire tube rather than purchasing unnecessary new cycle.',
      language: 'en',
    };

    const eventRes = await fetch(`${baseUrl}/api/student/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${arjunToken}`,
      },
      body: JSON.stringify(eventPayload),
    });
    assert(eventRes.status === 201, `Event submission must return 201, got ${eventRes.status}`);

    // Verify events retrieved for student STU-1042
    const fetchEventsRes = await fetch(`${baseUrl}/api/student/events`, {
      headers: { Authorization: `Bearer ${arjunToken}` },
    });
    const fetchEventsData = await fetchEventsRes.json();
    const storedEvent = fetchEventsData.events.find((e: any) => e.eventId === eventPayload.eventId);
    assert(!!storedEvent, 'Stored event must be returned in student event history');
    assert(storedEvent.studentId === 'STU-1042', 'Event studentId must be strictly STU-1042');
    assert(storedEvent.organizationId === 'org_vanguard', 'Event organizationId must match student org');
    console.log('✓ Test 3 Passed: Game events strictly stored against authenticated student ID');

    // -------------------------------------------------------------
    // Test Case 4: Authorized NGO staff can view assigned dashboard and profile
    // -------------------------------------------------------------
    console.log('Test 4: Authorized NGO staff dashboard and profile access...');
    const ngoLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'staff@vanguard.org',
        password: 'NgoStaff@2026',
        expectedRole: 'ngo_staff',
      }),
    });
    assert(ngoLoginRes.status === 200, 'NGO login must succeed');
    const ngoLoginData = await ngoLoginRes.json();
    const vanguardStaffToken = ngoLoginData.token;

    // View NGO overview
    const ngoOverviewRes = await fetch(`${baseUrl}/api/ngo/overview`, {
      headers: { Authorization: `Bearer ${vanguardStaffToken}` },
    });
    assert(ngoOverviewRes.status === 200, 'NGO overview access must succeed');
    const ngoOverviewData = await ngoOverviewRes.json();
    assert(ngoOverviewData.overview.totalAssignedStudents >= 2, 'Must report assigned Vanguard students');
    assert(!!ngoOverviewData.overview.pillarBreakdown.budget, 'Must provide budget pillar metrics');

    // View assigned student detail (STU-1042 belongs to org_vanguard)
    const studentDetailRes = await fetch(`${baseUrl}/api/ngo/students/STU-1042`, {
      headers: { Authorization: `Bearer ${vanguardStaffToken}` },
    });
    assert(studentDetailRes.status === 200, 'Staff must be able to view assigned student STU-1042');
    const studentDetailData = await studentDetailRes.json();
    assert(studentDetailData.student.studentId === 'STU-1042', 'Student ID must match STU-1042');
    assert(studentDetailData.events.length > 0, 'Must show student event history');
    console.log('✓ Test 4 Passed: Authorized NGO staff can view assigned dashboard & student profiles');

    // -------------------------------------------------------------
    // Test Case 5: Data from multiple students appears under correct individual profiles
    // -------------------------------------------------------------
    console.log('Test 5: Multi-student data isolation & accuracy...');
    const studentsListRes = await fetch(`${baseUrl}/api/ngo/students`, {
      headers: { Authorization: `Bearer ${vanguardStaffToken}` },
    });
    const studentsListData = await studentsListRes.json();
    const arjunInList = studentsListData.students.find((s: any) => s.studentId === 'STU-1042');
    const priyaInList = studentsListData.students.find((s: any) => s.studentId === 'STU-2088');

    assert(!!arjunInList && !!priyaInList, 'Both Vanguard students must appear in list');
    assert(arjunInList.name === 'Arjun (The Scholar)', 'Arjun details must belong to Arjun profile');
    assert(priyaInList.name === 'Priya (The Tech Whiz)', 'Priya details must belong to Priya profile');
    assert(arjunInList.walletBalance !== priyaInList.walletBalance, 'Individual balances must be preserved independently');
    console.log('✓ Test 5 Passed: Multiple students have distinct, segregated records');

    // -------------------------------------------------------------
    // Test Case 6: Student CANNOT access NGO pages or APIs
    // -------------------------------------------------------------
    console.log('Test 6: Student forbidden from accessing NGO endpoints...');
    const studentNgoOverviewRes = await fetch(`${baseUrl}/api/ngo/overview`, {
      headers: { Authorization: `Bearer ${arjunToken}` },
    });
    assert(studentNgoOverviewRes.status === 403, `Student access to NGO overview must be 403 Forbidden, got ${studentNgoOverviewRes.status}`);

    const studentNgoListRes = await fetch(`${baseUrl}/api/ngo/students`, {
      headers: { Authorization: `Bearer ${arjunToken}` },
    });
    assert(studentNgoListRes.status === 403, `Student access to NGO students list must be 403 Forbidden, got ${studentNgoListRes.status}`);

    const studentNgoDetailRes = await fetch(`${baseUrl}/api/ngo/students/STU-1042`, {
      headers: { Authorization: `Bearer ${arjunToken}` },
    });
    assert(studentNgoDetailRes.status === 403, `Student access to NGO student detail endpoint must be 403 Forbidden, got ${studentNgoDetailRes.status}`);
    console.log('✓ Test 6 Passed: Student token strictly rejected with 403 Forbidden on all NGO APIs');

    // -------------------------------------------------------------
    // Test Case 7: Student CANNOT retrieve another student\'s game data
    // -------------------------------------------------------------
    console.log('Test 7: Cross-student data tampering prevention...');
    // Attempt to update Priya's profile using Arjun's bearer token
    const tamperRes = await fetch(`${baseUrl}/api/student/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${arjunToken}`,
      },
      body: JSON.stringify({
        studentId: 'STU-2088', // Malicious attempt to change Priya's ID
        walletBalance: 0,
      }),
    });
    // Even if studentId was passed in body, server strips studentId and strictly updates req.user.studentId (STU-1042)
    assert(tamperRes.status === 200, 'Endpoint responds');
    const priyaProfile = Database.getStudentProfile('STU-2088');
    assert(priyaProfile!.walletBalance === 3100, "Priya's wallet balance must NOT be altered by Arjun's request");
    console.log('✓ Test 7 Passed: Students cannot access or overwrite another student\'s data by manipulating request payload');

    // -------------------------------------------------------------
    // Test Case 8: NGO staff CANNOT access students outside authorized organization
    // -------------------------------------------------------------
    console.log('Test 8: Cross-organization tenancy enforcement for NGO staff...');
    // Rahul (STU-3015) belongs to org_pratham, while staff@vanguard.org belongs to org_vanguard
    const crossOrgDetailRes = await fetch(`${baseUrl}/api/ngo/students/STU-3015`, {
      headers: { Authorization: `Bearer ${vanguardStaffToken}` },
    });
    assert(
      crossOrgDetailRes.status === 403,
      `Vanguard staff accessing Pratham student STU-3015 must be 403 Forbidden, got ${crossOrgDetailRes.status}`
    );

    // Verify Pratham student is not listed in Vanguard overview or student list
    const vanguardListStudents = studentsListData.students.map((s: any) => s.studentId);
    assert(!vanguardListStudents.includes('STU-3015'), 'Vanguard staff list must NOT contain Pratham students');
    console.log('✓ Test 8 Passed: NGO staff strictly forbidden from accessing students outside their organization');

    // -------------------------------------------------------------
    // Test Case 9: Unauthenticated requests rejected
    // -------------------------------------------------------------
    console.log('Test 9: Unauthenticated request rejection...');
    const noAuthRes1 = await fetch(`${baseUrl}/api/student/profile`);
    assert(noAuthRes1.status === 401, `Unauthenticated student endpoint must return 401, got ${noAuthRes1.status}`);

    const noAuthRes2 = await fetch(`${baseUrl}/api/ngo/overview`);
    assert(noAuthRes2.status === 401, `Unauthenticated NGO overview must return 401, got ${noAuthRes2.status}`);

    const badTokenRes = await fetch(`${baseUrl}/api/student/profile`, {
      headers: { Authorization: 'Bearer invalid.token.signature' },
    });
    assert(badTokenRes.status === 401, `Forged token must return 401, got ${badTokenRes.status}`);

    // Verify public registration CANNOT create NGO staff accounts
    const maliciousRegRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'hacker@attack.com',
        password: 'Password123',
        name: 'Attacker',
        role: 'ngo_staff', // Attempt to self-assign ngo_staff
      }),
    });
    const maliciousRegData = await maliciousRegRes.json();
    assert(maliciousRegData.user.role === 'student', 'Public registration must ignore or overwrite requested role to student');
    console.log('✓ Test 9 Passed: Unauthenticated and unauthorized operations strictly rejected');

    // -------------------------------------------------------------
    // Test Case 10: Client Route Guard & Path Matching Verification
    // -------------------------------------------------------------
    console.log('Test 10: Router path matching contracts...');
    const match1 = matchPath('/ngo/students/:studentId', '/ngo/students/STU-1042');
    assert(match1.matches === true, 'Path matcher must match student detail pattern');
    assert(match1.params.studentId === 'STU-1042', 'Student ID param must match STU-1042');

    const match2 = matchPath('/ngo/students/:studentId', '/ngo/dashboard');
    assert(match2.matches === false, 'Dashboard must not match student detail pattern');

    console.log('✓ Test 10 Passed: Client route matching and URL parsing functions correctly');

    console.log('\n============================================================');
    console.log('--- ALL 10 AUTHENTICATION & ACCESS CONTROL TESTS PASSED! ---');
    console.log('============================================================\n');
  } finally {
    server.close();
  }
}

runTestSuite()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Test suite failed with error:\n', err);
    process.exit(1);
  });
