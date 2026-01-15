function RootDashboard() {
  return <div>Root Dashboard</div>;
}
export default RootDashboard;
// // app/admin/root/dashboard/page.tsx
// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import { useStudents } from '@/lib/queries/useStudents';
// import { useTeachers } from '@/lib/queries/useTeachers';
// import { useSchools } from '@/lib/queries/useSchools';

// export default function RootDashboard() {
//   const { user, isLoading: authLoading } = useAuth();

//   // TanStack Query automatically fetches ALL data (root sees everything)
//   const { data: schools, isLoading: schoolsLoading } = useSchools();
//   const { data: students, isLoading: studentsLoading } = useStudents();
//   const { data: teachers, isLoading: teachersLoading } = useTeachers();

//   if (authLoading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Root Admin Dashboard</h1>
//       <p>Welcome, {user?.name}</p>

//       <section>
//         <h2>All Schools ({schools?.length || 0})</h2>
//         {schoolsLoading ? <p>Loading...</p> : (
//           <ul>
//             {schools?.map(school => <li key={school.id}>{school.name}</li>)}
//           </ul>
//         )}
//       </section>

//       <section>
//         <h2>All Students ({students?.length || 0})</h2>
//         {studentsLoading ? <p>Loading...</p> : (
//           <ul>
//             {students?.map(student => <li key={student.id}>{student.name}</li>)}
//           </ul>
//         )}
//       </section>

//       <section>
//         <h2>All Teachers ({teachers?.length || 0})</h2>
//         {teachersLoading ? <p>Loading...</p> : (
//           <ul>
//             {teachers?.map(teacher => <li key={teacher.id}>{teacher.name}</li>)}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }
