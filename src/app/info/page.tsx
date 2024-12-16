// import { GetServerSideProps } from 'next';
// import { getAPI } from "../../service/fetchAPI";

// interface Register {
//     house: number;
//     email: string;
// }

// interface InfoPageProps {
//     data: Register[];
// }

// export const getServerSideProps: GetServerSideProps<InfoPageProps> = async () => {
//     const pass = sessionStorage.getItem('data') || "prueba";
//     const API = `/api/allRegisters/${pass}`;
//     const data: Register[] = await getAPI(API);
//     return {
//         props: {
//             data,
//         },
//     };
// }

// export const InfoPage: React.FC<InfoPageProps> = ({ data }) => {
//     return (
//         <section className="max-w-2xl">
//             <h2 className="text-xl">Correos registrados</h2>

//             <button >Mostrar datos</button>

//             <table className="mt-4 bg-gray-700 rounded">
//                 <thead>
//                     <tr>
//                         <th className="min-w-44">Numero de casa</th>
//                         <th className="min-w-44">Email</th>  
//                     </tr>
//                 </thead>
//                 <tbody className="bg-gray-800">
//                     {data.map((item) => (
//                         <tr key={item.house}>
//                             <td>{item.house}</td>
//                             <td>{item.email}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//         </section>
//     )
// }

// export default InfoPage;