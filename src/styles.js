
import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  outerBox: {
    display: 'flex', 
    flexDirection:'row',
    '@media (max-width:600px)':{ flexDirection:'column'} ,
    justifyContent:'space-between', 
    alignItems:'center' ,
    m: 1,
    padding:'10px',
    background:'white',
    borderRadius:'50px !important',
    color: 'grey.300',
    // border: '1px solid',
    borderColor: 'transparent',
    borderRadius: 2, 
  },
  responsiveBar: {
    // '@media (max-width:600px)':{ width:"100% !important", paddingBottom:'20px'}
  },
  mapOptionBtn:{
    height:'100%',
    margin:'10px 10px 10px 10px !important'
  }
}));
