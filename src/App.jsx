import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import logo from "./assets/logo.png";
// eslint-disable-next-line no-unused-vars
import bgImg from "./assets/bg.png";
import textImg from "./assets/text.png";
import { SketchPicker } from "react-color";
import dexscreenerIcon from "./assets/Dexscreener 120x120.png";
import dextoolsIcon from "./assets/dextools 120x120.png";
import igIcon from "./assets/IG 120x120.png";
import tgIcon from "./assets/TG 120x120.png";
import tiktokIcon from "./assets/TikTok 120x120.png";
import xIcon from "./assets/X 120x120.png";
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Helmet } from 'react-helmet';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [stickers, setStickers] = useState([]);

  const canvasRef = useRef(null);
  const bgImgInputRef = useRef(null);
  const stickerImgInputRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [textColor, setTextColor] = useState("#000");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // You can adjust this threshold as needed
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
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

      // Update image position whenever selectedObject changes
      updateImagePosition();

      // Also, listen for object modification and update the image position accordingly
      const objectModifiedHandler = () => {
        updateImagePosition();
      };

      canvas.on("object:modified", objectModifiedHandler);

      return () => {
        canvas.off("object:modified", objectModifiedHandler);
      };
    }
  }, [canvas, selectedObject, isMobile]);

  useEffect(() => {
    const changeBackgroundImage = (backgroundImage, canvas) => {
      console.log(isMobile);
      fabric.Image.fromURL(backgroundImage, (img) => {
        // Calculate the new dimensions respecting the maximum width of 550px
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
      // Import images from all subfolders in the 'assets/stickers' directory
      const imageContext = import.meta.glob(
        "./assets/stickers/*.{png,jpg,jpeg,svg}"
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

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
    });

    setCanvas(newCanvas);

    // Event listener for object selection
    newCanvas.on("selection:created", (e) => {
      setSelectedObject(e.selected[0]);
    });

    newCanvas.on("object:modified", (e) => {
      setSelectedObject(e.target);
    });

    // Event listener for object deselection
    newCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const handleAddImage = (image) => {
    fabric.Image.fromURL(image, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(img.height * (200 / img.width));

      canvas.add(img);
    });
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSticker = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          img.scaleToWidth(100);
          img.scaleToHeight(img.height * (100 / img.width));
          canvas.add(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImageToLocal = () => {
    if (canvas) {
      const dataURL = saveImageToDataURL();
      const blob = dataURLToBlob(dataURL);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the object URL to free memory
      URL.revokeObjectURL(url);
    }
  };

  // Utility function to convert a data URL to a Blob
  const dataURLToBlob = (dataURL) => {
    const [header, data] = dataURL.split(",");
    const mimeString = header.match(/:(.*?);/)[1];
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) { // Corrected line
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeString });
  };

  const saveImageToDataURL = () => {
    return canvas.toDataURL({
      format: "jpeg",
      multiplier: 8,
      quality: 1,
    });
  };

  const copyCanvasToClipboard = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    fetch(dataURL)
      .then((res) => res.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);
        alert("Canvas image copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCanvasClear = () => {
    canvas.clear();
    canvas.backgroundColor = "#fff";

    // changeBackgroundImage(bgImg, canvas)
  };

  const handleDelete = () => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach((object) => {
        if (object.selectable) {
          canvas.remove(object);
        }
      });
      canvas.discardActiveObject().renderAll();
    }
  };

  const handleAddText = () => {
    const text = prompt("Enter your text:");

    const font = new FontFace("True Gore", "url(/fonts/TrueGore-Regular.otf)"); // Changed to True Gore

    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);

        const newText = new fabric.Text(text, {
          fontFamily: "True Gore", // Changed to True Gore
          fontSize: 40,
          fill: "#000",
          fontWeight: "bold",
          left: 10,
          top: 10,
          charSpacing: 1,
        });

        canvas.add(newText);
      })
      .catch((error) => {
        console.error("Failed to load the font:", error);
      });
  };

  const handleColorChange = (color) => {
    setTextColor(color.hex);

    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set("fill", color.hex);
      canvas.renderAll();
    }
  };

  return (
    <div className="min-h-screen">
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
        <link rel="canonical" href="https://ninjacat.ch/" />
      </Helmet>
       <div className="flex item-center justify-center mx-5">
        {isMobile ? (
          <div className="w-full pt-10 flex flex-col">
            <div className="w-full flex items-center justify-center gap-10">
              <img src={logo} className="w-[100px] h-[100px] rounded-[20px]" alt="ninja Cat project Logo" />
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
            <img src={logo} className="w-[100px] h-[100px] rounded-[20px]" alt="ninja Cat project Logo" />
            <img src={textImg} className="h-[150px]" alt="" />
            <div className="flex gap-5">
              <a href="https://t.me/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={tgIcon} alt="Telegram" className="w-[40px] h-[40px]" />
              </a>
              <a href="https://x.com/SolNinjaCatSol" target="_blank" rel="noreferrer">
                <img src={xIcon} alt="X" className="w/[40px] h/[40px]" />
              </a>
              <a href="https://www.instagram.com/solninjacatsol" target="_blank" rel="noreferrer">
                <img src={igIcon} alt="Instagram" className="w/[40px] h/[40px]" />
              </a>
              <a href="https://www.tiktok.com/@solninjacat" target="_blank" rel="noreferrer">
                <img src={tiktokIcon} alt="TikTok" className="w/[40px] h/[40px]" />
              </a>
              <a href="https://dexscreener.com/solana/f9mjetldppza9d6su2homt1bay3djzaksp8samcrydp4" target="_blank" rel="noreferrer">
                <img src={dexscreenerIcon} alt="Dexscreener" className="w/[40px] h/[40px]" />
              </a>
              <a href="https://www.dextools.io/app/en/solana/pair-explorer/F9MJEtLDppZA9d6Su2HomT1Bay3DjZaKSP8SamcrYDP4" target="_blank" rel="noreferrer">
                <img src={dextoolsIcon} alt="Dextools" className="w/[40px] h/[40px]" />
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
          <div className="mx-auto mb-7 bg-transparent rounded-xl relative w-full h-full">
            <canvas ref={canvasRef} className="w-full h-full portrait-mobile:w-[300px] landscape-mobile:w-[400px] desktop:w-[550px]" />
            {selectedObject && (
              <img
                onClick={handleDelete}
                id="selected-img"
                className="absolute cursor-pointer"
                style={{
                  top: selectedObject.top - 30,
                  left: selectedObject.left,
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
              className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-full md:w-1/3 lg:w-1/3"
            >
              <p className=" text-center text-2xl tracking-wider font-medium relative">
                ADD TEXT
              </p>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
            </div>
            <div
              onClick={handleCanvasClear}
              className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w/full sm:w/full md:w-1/3 lg:w-1/3"
            >
              <p className=" text-center text-2xl tracking-wider font-medium relative">
                RESET
              </p>
              <div className="absolute top-0 left-0 w/full h/full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
            </div>

            <div
              onClick={saveImageToLocal}
              className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w/full sm:w/full md:w-1/3 lg:w-1/3"
            >
              <p className=" text-center text-2xl tracking-wider font-medium relative">
                SAVE MEME
              </p>
              <div className="absolute top-0 left-0 w/full h/full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
            </div>

            <div
              onClick={copyCanvasToClipboard}
              className="border-4 cursor-pointer border-black bg-white  px-5 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 w/full sm:w/full md:w-1/3 lg:w-1/3"
            >
              <p className=" text-center text-2xl tracking-wider font-medium relative">
                COPY MEME
              </p>
              <div className="absolute top-0 left-0 w/full h/full bg-black opacity-0 z-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 mt-5 w/full lg:w-[60%] px-5 lg:pl-0 pb-10 lg:pb-0">
          <div className="w-0 lg:w-1 h/full bg-white">.</div>
          <div className="w/full pl-5">
            {/* <h1 className="text-4xl text-center text-white mt-10">
              Create Your PFP
            </h1> */}
            <div className="flex flex-wrap mt-10 justify-center lg:justify-start">
              {stickers.length != 0 &&
                stickers.map((img, i) => (
                  <img
                    src={img}
                    key={i}
                    onClick={() => handleAddImage(img)}
                    className="  w/[150px] h/[150px] m-2 cursor-pointer"
                  ></img>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
     );
} 
export default App;
