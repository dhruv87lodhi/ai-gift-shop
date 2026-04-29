"use client";

import { useEffect, useState, useRef } from "react";
import { View, Smartphone, RotateCcw, Maximize2, X } from "lucide-react";

// 3D model mapping for products that have AR support
// Using reliable models from Google's model-viewer shared assets and Khronos glTF samples
const AR_MODELS = {
  // Tech - Gaming Mechanical Keyboard
  7: {
    glb: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    label: "Gaming Keyboard 3D",
  },
  // Tech - Wireless Noise Cancelling Pods
  11: {
    glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    label: "Wireless Pods 3D",
  },
  // Tech - Fitness Smart Band
  30: {
    glb: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    label: "Smart Band 3D",
  },
  // Tech - Bluetooth Portable Speaker
  41: {
    glb: "https://modelviewer.dev/shared-assets/models/RocketShip.glb",
    label: "Speaker 3D",
  },
  // Tech - Vinyl Record Player
  51: {
    glb: "https://modelviewer.dev/shared-assets/models/coffeemat.glb",
    label: "Record Player 3D",
  },
  // Personalized - LED Photo Frame
  3: {
    glb: "https://modelviewer.dev/shared-assets/models/shishkebab.glb",
    label: "Photo Frame 3D",
  },
  // Home Decor - Aroma Diffuser
  20: {
    glb: "https://modelviewer.dev/shared-assets/models/sphere.glb",
    label: "Aroma Diffuser 3D",
  },
  // Toys - Giant Teddy Bear
  33: {
    glb: "https://modelviewer.dev/shared-assets/models/Horse.glb",
    label: "Teddy Bear 3D",
  },
  // Tech - RGB Gaming Mouse Pad
  16: {
    glb: "https://modelviewer.dev/shared-assets/models/odd-shape-labeled.glb",
    label: "Mouse Pad 3D",
  },
  // Tech - Polaroid Instant Camera
  52: {
    glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    label: "Camera 3D",
  },
};

export function hasARSupport(productId) {
  return !!AR_MODELS[productId];
}

export default function ARViewer({ productId, productName }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const containerRef = useRef(null);
  const arModel = AR_MODELS[productId];

  useEffect(() => {
    // Dynamically load model-viewer script
    if (typeof window !== "undefined" && !customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Inject model-viewer element after the container is mounted and script is loaded
  useEffect(() => {
    if (!showAR || !isLoaded || !containerRef.current || !arModel) return;

    const container = containerRef.current;
    // Clear any previous model-viewer
    container.innerHTML = "";

    const mv = document.createElement("model-viewer");
    mv.setAttribute("src", arModel.glb);
    mv.setAttribute("alt", `3D model of ${productName}`);
    mv.setAttribute("ar", "");
    mv.setAttribute("ar-modes", "scene-viewer quick-look webxr");
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("auto-rotate", "");
    mv.setAttribute("shadow-intensity", "1");
    mv.setAttribute("shadow-softness", "1");
    mv.setAttribute("exposure", "1");
    mv.setAttribute("environment-image", "neutral");
    mv.style.width = "100%";
    mv.style.height = "100%";
    mv.style.setProperty("--poster-color", "transparent");

    // Create AR button
    const arBtn = document.createElement("button");
    arBtn.slot = "ar-button";
    arBtn.innerHTML = "📱 View in Your Space";
    Object.assign(arBtn.style, {
      position: "absolute",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #caa161, #b08a50)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "50px",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 8px 25px rgba(202, 161, 97, 0.4)",
      zIndex: "10",
    });

    mv.appendChild(arBtn);
    container.appendChild(mv);
  }, [showAR, isLoaded, arModel, productName]);

  if (!arModel) return null;

  return (
    <>
      {/* AR Button Trigger */}
      <button
        onClick={() => setShowAR(true)}
        className="group relative w-full mt-3 py-4 border-2 border-[#caa161]/30 bg-[#caa161]/5 text-[#9a7638] rounded-xl font-bold text-lg transition-all hover:bg-[#caa161] hover:text-white hover:border-[#caa161] hover:shadow-lg hover:shadow-[#caa161]/20 hover:scale-[1.01] flex items-center justify-center gap-3 overflow-hidden"
      >
        {/* Animated shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <View className="w-5 h-5" />
        <span>View in 3D / AR</span>
        <span className="ml-2 px-2 py-0.5 bg-[#caa161]/15 group-hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
          Beta
        </span>
      </button>

      {/* AR Modal */}
      {showAR && (
        <div
          className={`fixed inset-0 z-[9999] ${
            isFullscreen ? "" : "flex items-center justify-center p-4"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowAR(false);
              setIsFullscreen(false);
            }}
          />

          {/* Modal Content */}
          <div
            className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
              isFullscreen
                ? "w-full h-full rounded-none"
                : "w-full max-w-3xl h-[80vh]"
            }`}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-white via-white/90 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#caa161] to-[#b08a50] flex items-center justify-center">
                  <View className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {productName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    3D Preview &middot; Drag to rotate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Toggle fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setShowAR(false);
                    setIsFullscreen(false);
                  }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Viewer Container */}
            <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
              {isLoaded ? (
                <div ref={containerRef} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <RotateCcw className="w-10 h-10 text-[#caa161] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      Loading 3D model...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-white via-white/90 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Drag to rotate
                  </span>
                  <span className="flex items-center gap-1">🤏 Pinch to zoom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#caa161]" />
                  <span className="text-xs font-bold text-[#9a7638]">
                    AR Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
