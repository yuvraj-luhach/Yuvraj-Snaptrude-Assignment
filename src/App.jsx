
import React , { useEffect, useRef, useState } from "react";
import './App.css'
import Geocoder from './GeoCoderSearch.jsx'
import {  Container, Typography, Paper, Menu, MenuItem, Grow, Box, Button, CircularProgress, LinearProgress } from "@mui/material";

// import useStyles from "./styles";

import 'mapbox-gl/dist/mapbox-gl.css';

import Map, { Marker,NavigationControl ,FullscreenControl,GeolocateControl, } from "react-map-gl";

import html2canvas from 'html2canvas';

import { ArcRotateCamera, Vector3 , HDRCubeTexture, Tools, PBRMaterial , Texture , HemisphericLight, MeshBuilder, Color3 } from "@babylonjs/core";
import SceneComponent from "./CuboidModel";


function App() {
  const apiKey = import.meta.env.VITE_REACT_APP_MAPS_API_KEY
  
  const [loading, setLoading] = useState(false);

  // const classes = useStyles();
  const mapRef = useRef();
  const [showMap, setShowMap] = React.useState(false);
  const [mapStyle, setMapStyle] = React.useState('mapbox://styles/mapbox/satellite-streets-v12');
  const [projection, setProjection] = React.useState('globe');

  const [anchorElMapStyle, setAnchorElMapStyle] = useState(null);
  const handleClick = (event) => {
    setAnchorElMapStyle(event.currentTarget);
  };
  function handleClose(index){
    if(index===1){
      setProjection('mercator')
    }else{
      setProjection('globe')
    }
    setAnchorElMapStyle(null);
  };
  const [anchorElProjection, setAnchorElProjection] = useState(null);
  const handleClick2 = (event) => {
    setAnchorElProjection(event.currentTarget);
  };
  function handleClose2(index) {
    if(index===1){
      setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')
    }else{
      setMapStyle('mapbox://styles/mapbox/outdoors-v12')
    }
    setAnchorElProjection(null);
  };
  
  const [imgUrl,setImgUrl] = React.useState('/images/clickInstruction.jpg') ;
  const [capturedImg,setCapturedImg] = React.useState('/images/clickInstruction.jpg') ;
  let box;

  const handleSnapshot = () => {

    html2canvas(mapRef.current.getCanvas()).then(canvas => {

      const mapImgBase64 = canvas.toDataURL('image/png');

      let imageOfMap = convertBase64ToFile(mapImgBase64, "image.png");

      let localImgUrl = URL.createObjectURL(imageOfMap)
      setImgUrl(localImgUrl)
      
      document.getElementById('mapImage').src = localImgUrl

    });
  }

  function convertBase64ToFile(base64String, fileName){
    let arr = base64String.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
       uint8Array[n] = bstr.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: mime });
    return file;
  }

  setTimeout(() => {
    setShowMap(true)
  }, 3000);

  // const [lng, setLng] = useState(77.5913);
  const [lng, setLng] = useState();
  
  // const [lat, setLat] = useState(12.97912);
  const [lat, setLat] = useState();

  useEffect(() => {
    if (!lng && !lat) {
      fetch('https://ipapi.co/json')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLat(data.latitude)
          setLng(data.longitude)
        });
    }
  }, []);

  useEffect(() => {
    return () => {
    }
  }, [capturedImg])
  
  const onSceneReady = (scene) => {

    scene.clearColor = new Color3(.300,.450,.700)

    var camera = new ArcRotateCamera("camera1",Tools.ToRadians(268),Tools.ToRadians(60),8, Vector3.Zero() , scene);
    
    camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    light.intensity = 0.7;

    var hdrTexture = new HDRCubeTexture(
        "https://dl.dropbox.com/s/6eyb6pgqiq43xbz/this.hdr",
        scene,412
    );
    hdrTexture.level = 1;

    box = MeshBuilder.CreateBox("box",{height: 2.5, width: 5, depth:1.75},scene);

    var cubeTexture = new Texture(capturedImg,scene)
    var cubeMat= new PBRMaterial("box",scene);
    cubeMat.albedoTexture = cubeTexture;
    cubeMat.reflectionTexture = hdrTexture;
    cubeMat.roughness = 1;
    cubeMat.metallic = 1;
    box.material = cubeMat;

    box.position.y = .3;
    box.position.z = 0;
  };

  const onRender = (scene) => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 4;
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);

      setTimeout(() => {
        setLoading(false)
      }, 3000);
    }
  };

  return (
    <div>
      <Grow in>
        <Container maxWidth="xl">
          <Box sx={{display: 'flex', flexDirection:'row', '@media (max-width:600px)':{ flexDirection:'column'} ,justifyContent:'space-between', alignItems:'center' ,m: 1,padding:'10px',background:'white',color: 'grey.300',borderColor: 'transparent',borderRadius: 2}} > 
            <Box sx={{width:"100%"}}>
              <Typography sx={{ color:'#000', fontSize:'2rem'}} >
                Snaptrude Assignment - <span style={{fontSize:'1.5rem'}}>Made by Yuvraj</span>
              </Typography>
              <Typography sx={{ color:'red', fontStyle:'italic', fontSize:'15px'}} >
                Note : For smooth fuctioning of Map by Mapbox make sure any extension like Adblocker is disabled on this site. If problem persists then disable all extensions.
              </Typography>
            </Box>
          </Box>
          <Box sx={{marginTop:'50px', marginBottom:'50px'}}>
            {!showMap ? <div style={{height:'600px', width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}> <CircularProgress /> </div>: 

              <Map ref={mapRef} preserveDrawingBuffer={true} initialViewState={{longitude: lng,latitude: lat,}} minZoom={2} 
              projection={projection} mapStyle={mapStyle} mapboxAccessToken={apiKey} style={{height:'600px',borderRadius:'5px',}}>
                  <Marker draggable onDragEnd={(e) =>{setLat(e.lngLat.lat); setLng(e.lngLat.lng)}} longitude={lng} latitude={lat}/>
                  <NavigationControl position="bottom-left" />
                  <Geocoder setLat={setLat} setLng={setLng} position="top-right" />
                  <FullscreenControl position="top-left"/>
                  <GeolocateControl position="top-left" onGeolocate={(e)=> {setLat(e.coords.latitude); setLng(e.coords.longitude)}} showUserLocation={true} />

                  <Button sx={{height:'100%',margin:'10px 10px 10px 10px !important'}} variant="contained" color="primary" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    Map / Globe
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorElMapStyle}
                    keepMounted
                    open={Boolean(anchorElMapStyle)}
                    // onClose={handleClose}
                  >
                    <MenuItem onClick={()=>{handleClose(1)}}>Map</MenuItem>
                    <MenuItem onClick={()=>{handleClose(2)}}>Globe</MenuItem>
                  </Menu>

                  <Button sx={{height:'100%',margin:'10px 10px 10px 10px !important'}} variant="contained" color="primary" aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClick2}>
                    Sattelite / Outdoors
                  </Button>
                  <Menu
                    id="simple-menu2"
                    anchorEl={anchorElProjection}
                    keepMounted
                    open={Boolean(anchorElProjection)}
                    // onClose={handleClose2}
                  >
                    <MenuItem onClick={()=>{handleClose2(1)}}>Sattelite</MenuItem>
                    <MenuItem onClick={()=>{handleClose2(2)}}>Outdoors</MenuItem>
                  </Menu>

                    <Button sx={{height:'100%',margin:'10px 10px 10px 10px !important'}} onClick={()=>handleSnapshot()} color="success" variant="contained" >
                      Capture Image
                    </Button>

                </Map>
              }
          </Box>
          <img id="mapImage" className="borderR" src="/images/clickInstruction.jpg" style={{maxHeight:'600px', width:'100%', marginBottom:'50px'}} alt="" />

          <Button sx={{height:'100%',margin:'10px 10px 10px 10px !important'}} onClick={()=>{setLoading(true);setCapturedImg(imgUrl)}} color="secondary" variant="contained">
            {loading ? <div style={{minWidth:'150px', height:'25px'}}><LinearProgress /></div> : 'Apply above image to 3d model'}
          </Button>
          <Paper>
            <Typography sx={{ color:'red', fontStyle:'italic', fontSize:'15px'}} >
                Get original size model by clicking the button above
            </Typography>
          </Paper>
          <SceneComponent capturedimg={capturedImg} antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
        </Container>
      </Grow>
    </div>
  )
}

export default App
