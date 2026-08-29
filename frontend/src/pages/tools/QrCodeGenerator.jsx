import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaQrcode, FaDownload, FaRedo, FaLink, FaCheckCircle } from 'react-icons/fa';
import RelatedTools from '../../components/RelatedTools';

const QrCodeGenerator = () => {
  const [text, setText] = useState('https://edutools.lk');
  const [size, setSize] = useState(220);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const qrRef = useRef(null);

  const handleReset = () => {
    setText('https://edutools.lk');
    setSize(220);
    setFgColor('#0f172a');
    setBgColor('#ffffff');
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edutools-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-violet-50 text-violet-600 rounded-2xl border border-violet-200">
            <FaQrcode className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">QR Code Generator</h1>
            <p className="text-sm text-slate-500">Generate high-resolution QR codes for websites, text, and study assignments.</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FaRedo className="text-[10px]" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaLink className="text-violet-600" />
            <span>QR Content & Customization</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Text or URL Content</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text (e.g. https://edutools.lk)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-mono">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-mono">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>QR Size (Pixels):</span>
                <span>{size}px</span>
              </div>
              <input
                type="range"
                min="150"
                max="400"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Download Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-6 flex flex-col items-center justify-between">
          <div className="space-y-4 w-full">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Live QR Preview</span>

            {/* QR Canvas Container */}
            <div ref={qrRef} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
              {text.trim() !== '' ? (
                <QRCodeCanvas
                  value={text}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400 font-medium">
                  Enter content to generate QR code
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={text.trim() === ''}
            className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              text.trim() === ''
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20'
            }`}
          >
            <FaDownload /> Download PNG Image
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <FaCheckCircle className="text-emerald-500" />
            <span>High-resolution PNG file ready for print and sharing.</span>
          </div>
        </div>

      </div>

      {/* Related Tools */}
      <RelatedTools currentToolSlug="qr-code-generator" />
    </div>
  );
};

export default QrCodeGenerator;
