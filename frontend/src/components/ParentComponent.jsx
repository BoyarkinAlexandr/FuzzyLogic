// import React, { useState } from 'react';
// import Compozition from './Compozition';
// import { Box, Typography } from '@mui/material';

// const ParentComponent = () => {
//   const [result, setResult] = useState(null);

//   const handleResult = (resultData) => {
//     setResult(resultData);  // Сохраняем результат в состоянии
//   };

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Compozition onResult={handleResult} />
      
//       {result && (
//         <Box sx={{ marginTop: 3 }}>
//           <Typography variant="h6">Максминная композиция:</Typography>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
//             {result.maxmin.map((row, rowIndex) => (
//               <Box key={rowIndex} sx={{ display: 'flex', gap: 1 }}>
//                 {row.map((col, colIndex) => (
//                   <Typography key={colIndex} sx={{ textAlign: 'center', border: '1px solid #ccc', padding: 1 }}>
//                     {col.toFixed(2)}
//                   </Typography>
//                 ))}
//               </Box>
//             ))}
//           </Box>

//           <Typography variant="h6" sx={{ marginTop: 2 }}>Минимаксная композиция:</Typography>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
//             {result.minmax.map((row, rowIndex) => (
//               <Box key={rowIndex} sx={{ display: 'flex', gap: 1 }}>
//                 {row.map((col, colIndex) => (
//                   <Typography key={colIndex} sx={{ textAlign: 'center', border: '1px solid #ccc', padding: 1 }}>
//                     {col.toFixed(2)}
//                   </Typography>
//                 ))}
//               </Box>
//             ))}
//           </Box>

//           <Typography variant="h6" sx={{ marginTop: 2 }}>Максумножительная1 композиция:</Typography>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
//             {result.maxmul.map((row, rowIndex) => (
//               <Box key={rowIndex} sx={{ display: 'flex', gap: 1 }}>
//                 {row.map((col, colIndex) => (
//                   <Typography key={colIndex} sx={{ textAlign: 'center', border: '1px solid #ccc', padding: 1 }}>
//                     {col.toFixed(2)}
//                   </Typography>
//                 ))}
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ParentComponent;
