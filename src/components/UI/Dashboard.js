import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';

import reportImg from '../../assets/imgs/report_.jpg';
import graphImg from '../../assets/imgs/3d-graph.jpg';
import analyticsImg from '../../assets/imgs/sbdskvnwa9db7lwsj44wnwpfjbiylas9rsmjpxefkwvrvonxejw8222yjpmmw3bu-.jpg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClusteredData } from '../ClusteredData';
import { Login } from '../auth/Login';
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export const Dashboard = (props) => {
  const getAuth = useSelector((state) => state.auth);
  const { loading, err, user, isLoggedIn } = getAuth;

  return <>{isLoggedIn ? <ClusteredData /> : <Login />}</>;
};

// const dashboardBox = () => {
//   const classes = useStyles();
//   return (
//     <Box display="flex" justifyContent="center" m={1} p={1}>
//       <Box m={1} p={1}>
//         <Card className={classes.root}>
//           <CardActionArea>
//             <CardMedia
//               component="img"
//               alt="Analitics"
//               height="250"
//               image={analyticsImg}
//               title="Analytics"
//             />
//           </CardActionArea>
//           <CardActions>
//             <Typography textAlign="center">
//               <Link
//                 to="/clusters"
//                 variant="body2"
//                 style={{ textDecoration: 'none' }}
//               >
//                 Cluster Reports
//               </Link>
//             </Typography>
//           </CardActions>
//         </Card>
//       </Box>
//       <Box m={1} p={1}>
//         <Card className={classes.root}>
//           <CardActionArea>
//             <CardMedia
//               component="img"
//               alt="Graphs"
//               height="250"
//               image={graphImg}
//               title="Graphs"
//             />
//           </CardActionArea>
//           <CardActions textAlign="center">
//             <Typography align="center">
//               <Link href="#" variant="body2" style={{ textDecoration: 'none' }}>
//                 Analitic Graphs
//               </Link>
//             </Typography>
//           </CardActions>
//         </Card>
//       </Box>
//       <Box m={1} p={1}>
//         <Card className={classes.root}>
//           <CardActionArea>
//             <CardMedia
//               component="img"
//               alt="Reports"
//               height="250"
//               image={reportImg}
//               title="Reports"
//             />
//           </CardActionArea>
//           <CardActions textAlign="center">
//             <Typography align="center">
//               <Link href="#" variant="body2" style={{ textDecoration: 'none' }}>
//                 RADAR Reports
//               </Link>
//             </Typography>
//           </CardActions>
//         </Card>
//       </Box>
//     </Box>
//   );
// };
