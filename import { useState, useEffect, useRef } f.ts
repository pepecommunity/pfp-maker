import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import logo from "./assets/logo.png";
// import bgImg from "./assets/bg.png"; // Unused variable
import textImg from "./assets/text.png";
import { SketchPicker } from "react-color";
import dexscreenerIcon from "./assets/Dexscreener 120x120.png";
import dextoolsIcon from "./assets/dextools 120x120.png";
import igIcon from "./assets/IG 120x120.png";
import tgIcon from "./assets/TG 120x120.png";
import tiktokIcon from "./assets/TikTok 120x120.png";
import xIcon from "./assets/X 120x120.png";
import { Helmet } from 'react-helmet';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(550);
  const [canvasHeight, setCanvasHeight] = useState(550);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const bgImgInputRef = useRef(null);
  const [stickers, setStickers] = useState([]);
  const stickerImgInputRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textColor, setTextColor] = useState("#000");

  useEffect(() => {
    const handleResize = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        setCanvasWidth(isPortrait ? 300 : 400);
        setCanvasHeight(isPortrait ? 300 : 400);
      } else {
        setCanvasWidth(550);
        setCanvasHeight(550);
      }
      setIsMobile(isMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: isMobile ? (window.matchMedia("(orientation: portrait)").matches ? 300 : 400) : 550,
        height: isMobile ? (window.matchMedia("(orientation: portrait)").matches ? 300 : 400) : 550,
        backgroundColor: "#fff",
      });
      setCanvas(newCanvas);

      return () => {
        newCanvas.dispose(); // Clean up on component unmount
      };
    }
  }, [canvasRef, isMobile, canvas]);

  useEffect(() => {
    if (selectedObject) {
      const updateImagePosition = () => {
        const imgElement = document.getElementById("selected-img");

        if (imgElement) {
          imgElement.style.top = `${selectedObject.top - 30}px`;
          imgElement.style.left = `${selectedObject.left}px`;
        }
      };

      updateImagePosition();
    }
  }, [selectedObject]);

  useEffect(() => {
    const changeBackgroundImage = (backgroundImage, canvas) => {
      fabric.Image.fromURL(backgroundImage, (img) => {
        let newWidth = img.width;
        let newHeight = img.height;

        let maxWidth = isMobile ? 300 : 550;

        if (img.width > maxWidth) {
          canvas.setWidth(newWidth);
          canvas.setHeight(newHeight);
        }
      });
    };

    if (!canvas) return;

    if (backgroundImage) {
      changeBackgroundImage(backgroundImage, canvas);
    } else {
      canvas.setBackgroundImage("", canvas.renderAll.bind(canvas));
    }
  }, [canvas, backgroundImage, isMobile]);

  useEffect(() => {
    const importStickers = async () => {
      const imageContext = import.meta.glob(
        "./assets/stickers/*.(png|jpg|jpeg|svg)"
      );

      const imagePaths = await Promise.all(
        Object.values(imageContext).map(async (importPromise) => {
          const imageModule = await importPromise();
          return imageModule.default;
        })
      );

      // Use the categorized images as needed
      setStickers(imagePaths);
    };

    importStickers();
  }, []);
  useEffect(() => {
    if (selectedObject) {
      const updateImagePosition = () => {
        const imgElement = document.getElementById("selected-img");
  
        if (imgElement) {
          imgElement.style.top = `${selectedObject.top - 30}px`;
          imgElement.style.left = `${selectedObject.left}px`;
        }
      };
  
      updateImagePosition();
    }
  }, [selectedObject]);

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        setBackgroundImage(f.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSticker = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          canvas.add(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (selectedObject) {
      canvas.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleColorChange = (color) => {
    setTextColor(color.hex);
    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ fill: color.hex });
      canvas.renderAll();
    }
  };

  const handleAddText = () => {
    const text = new fabric.Textbox("New Text", {
      left: 50,
      top: 50,
      fill: textColor,
    });
    canvas.add(text);
    setSelectedObject(text);
  };

  const handleCanvasClear = () => {
    canvas.clear();
    setBackgroundImage(null);
  };

  const saveImageToLocal = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  const copyCanvasToClipboard = () => {
    canvas.getElement().toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
  };

  const handleAddImage = (img) => {
    fabric.Image.fromURL(img, (image) => {
      canvas.add(image);
    });
  };
  return (
    <div className={`min-h-screen`}>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Welcome to Ninja Cat PFP MAKER, where you can create your custom profile picture, connect via our socials, and explore Dex listings."  />
        <meta name="author" content="Ninja Cat Team" />
        <meta name="robots" content="index, follow" />
        <title>Ninja Cat CTO - $NC: Solana&#39;s Shadow Warrior</title>
        <link rel="icon" href="./assets/$NC-Ninja-Cat-logo-favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="./assets/$NC-Ninja-Cat-logo-apple-touch-180.png" sizes="180x180" />
        <link rel="icon" href="./assets/$NC-Ninja-Cat-logo-favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="./assets/$NC-Ninja-Cat-logo-msapplication-TileImage.png" />
        <meta name="msapplication-TileImage" content="./assets/$NC-Ninja-Cat-logo-msapplication-TileImage.png" />
        <meta name="msapplication-TileColor" content="#FCC01E" />
        <meta property="og:url" content="https://ninjacat.ch/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ninja Cat CTO - $NC: Solana's Shadow Warrior" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://ninjacat.ch/src/assets/NC-twitter-card-1200x627.png" />
        <meta property="og:description" content="Welcome to Ninja Cat PFP MAKER, where you can create your custom profile picture, connect via our socials, and explore Dex listings." />
        <meta property="og:updated_time" content="1734829524" />
        <meta property="og:image:alt" content="Welcome to Ninja Cat PFP MAKER, where you can create your custom profile picture, connect via our socials, and explore Dex listings."/>
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="ninjacat.ch" />
        <meta property="twitter:url" content="https://ninjacat.ch" />
        <meta name="twitter:title" content="Ninja Cat CTO - $NC: Solana's Shadow Warrior" />
        <meta name="twitter:description" content="Welcome to Ninja Cat PFP MAKER, where you can create your custom profile picture, connect via our socials, and explore Dex listings."  />
        <meta name="twitter:image" content="https://ninjacat.ch/src/assets/NC-twitter-card-1200x627.png" />
        <link rel="canonical" href="https://ninjacat.ch/"/>
      </Helmet>
       <div className="flex item-center justify-center mx-5">
        {isMobile ? (
          <div className="w-full pt-10 flex flex-col">
            <div className="w-full flex items-center justify-center gap-10">
              <img src={logo} className="w-[100px] h-[100px]" style={{ borderRadius: '20px' }} alt="ninja Cat project Logo" />
              <h1 className=" bounceIn animated text-white mt-10 text-5xl lg:mb-10 md:text-7xl text-center font-black ">
                Ninja Cat PFP Maker
              </h1>
            </div>
            <div className="flex items-center justify-center pt-10 gap-5">
              <a href="https://t.me/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={tgIcon} alt="Telegram" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://x.com/SolNinjaCatSol" target="_blank" rel="noreferrer">
                <img src={xIcon} alt="X" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.instagram.com/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={igIcon} alt="Instagram" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.tiktok.com/@solninjacat" target="_blank" rel="noreferrer">
                <img src={tiktokIcon} alt="TikTok" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://dexscreener.com/solana/f9mjetldppza9d6su2homt1bay3djzaksp8samcrydp4" target="_blank" rel="noreferrer">
                <img src={dexscreenerIcon} alt="Dexscreener" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.dextools.io/app/en/solana/pair-explorer/F9MJEtLDppZA9d6Su2HomT1Bay3DjZaKSP8SamcrYDP4" target="_blank" rel="noreferrer">
                <img src={dextoolsIcon} alt="Dextools" className="w-[40px] h-[40px]" />
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full pt-5 flex items-center justify-around">
            <img src={logo} className="w-[100px] h-[100px]" style={{ borderRadius: '20px' }} alt="ninja Cat project Logo" />
            <img src={textImg} className="h-[150px]" alt="" />
            <div className="flex gap-5">
              <a href="https://t.me/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={tgIcon} alt="Telegram" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://x.com/SolNinjaCatSol" target="_blank" rel="noreferrer">
                <img src={xIcon} alt="X" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.instagram.com/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={igIcon} alt="Instagram" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.tiktok.com/@solninjacat" target="_blank" rel="noreferrer">
                <img src={tiktokIcon} alt="TikTok" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://dexscreener.com/solana/f9mjetldppza9d6su2homt1bay3djzaksp8samcrydp4" target="_blank" rel="noreferrer">
                <img src={dexscreenerIcon} alt="Dexscreener" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://www.dextools.io/app/en/solana/pair-explorer/F9MJEtLDppZA9d6Su2HomT1Bay3DjZaKSP8SamcrYDP4" target="_blank" rel="noreferrer">
                <img src={dextoolsIcon} alt="Dextools" className="w-[40px] h-[40px]" />
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex lg:py-10 flex-col-reverse lg:flex-row justify-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={bgImgInputRef}
        onChange={handleBackgroundImageChange}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={stickerImgInputRef}
        onChange={handleAddSticker}
      />
      <div className="flex-1 px-5">
        <div
          className={`mx-auto mb-7 bg-transparent rounded-xl relative
        ${isMobile ? "canvas-mobile" : "w-[550px]"}
        `}
        >
          <canvas
            ref={canvasRef}
            // style={{ width: "550px", height: "550px" }}
          />
          {selectedObject && (
            <img
              onClick={handleDelete}
              id="selected-img"
              style={{
                position: "absolute",
                top: selectedObject.top - 30,
                left: selectedObject.left,
                cursor: "pointer",
              }}
              src="https://cdn-icons-png.flaticon.com/512/5610/5610967.png"
              width={20}
              height={20}
              alt=""
            />
          )}
        </div>
        {selectedObject && selectedObject.type === "text" && (
          <div className="flex justify-center my-10">
            <SketchPicker color={textColor} onChange={handleColorChange} />
          </div>
        )}
        <div className="flex flex-wrap w-full gap-5 justify-center pb-10 lg:pb-0">
          <div
            onClick={() => stickerImgInputRef.current.click()}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-full md:w-1/3 lg:w-1/3"
          >
            <p className=" text-center text-2xl tracking-wider font-medium relative">
              UPLOAD STICKER
            </p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
          </div>
          <div
            onClick={() => bgImgInputRef.current.click()}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-full md:w-1/3 lg:w-1/3"
          >
            <p className=" text-center text-2xl tracking-wider font-medium relative">
              UPLOAD BACKGROUND
            </p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
          </div>
          <div
            onClick={handleAddText}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration      <div className="w-full flex lg:py-10 flex-col-reverse lg:flex-row justify-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={bgImgInputRef}
        onChange={handleBackgroundImageChange}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={stickerImgInputRef}
        onChange={handleAddSticker}
      />
      <div className="flex-1 px-5">
        <div
          className={`mx-auto mb-7 bg-transparent rounded-xl relative
        ${isMobile ? "canvas-mobile" : "w-[550px]"}
        `}
        >
          <canvas
            ref={canvasRef}
            // style={{ width: "550px", height: "550px" }}
          />
          {selectedObject && (
            <img
              onClick={handleDelete}
              id="selected-img"
              style={{
                position: "absolute",
                top: selectedObject.top - 30,
                left: selectedObject.left,
                cursor: "pointer",
              }}
              src="https://cdn-icons-png.flaticon.com/512/5610/5610967.png"
              width={20}
              height={20}
              alt=""
            />
          )}
        </div>
        {selectedObject && selectedObject.type === "text" && (
          <div className="flex justify-center my-10">
            <SketchPicker color={textColor} onChange={handleColorChange} />
          </div>
        )}
        <div className="flex flex-wrap w-full gap-5 justify-center pb-10 lg:pb-0">
          <div
            onClick={() => stickerImgInputRef.current.click()}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-full md:w-1/3 lg:w-1/3"
          >
            <p className=" text-center text-2xl tracking-wider font-medium relative">
              UPLOAD STICKER
            </p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
          </div>
          <div
            onClick={() => bgImgInputRef.current.click()}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-full md:w-1/3 lg:w-1/3"
          >
            <p className=" text-center text-2xl tracking-wider font-medium relative">
              UPLOAD BACKGROUND
            </p>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
          </div>
          <div
            onClick={handleAddText}
            className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration