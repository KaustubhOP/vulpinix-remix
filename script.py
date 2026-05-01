import re

with open('e:/vulpinix-remix/logic.txt', 'r', encoding='utf-8') as f:
    logic = f.read()

# Add useScroll and useSpring to imports
logic = logic.replace('import { motion, AnimatePresence }', 'import { motion, AnimatePresence, useScroll, useSpring }')

jsx = '''  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const enabledPlatforms = platforms.filter(p => p.enabled);
  const estimatedReach = enabledPlatforms.length * 2500;
  const aiScore = 94;

  const steps = [
    { id: 1, label: "Upload File", completed: !!uploadedFile },
    { id: 2, label: "AI Captions", completed: !!aiAnalysis.caption },
    { id: 3, label: "Choose Platforms", completed: platforms.some(p => p.enabled) },
    { id: 4, label: "Schedule", completed: !!scheduleDate },
    { id: 5, label: "Summary", completed: analysisComplete }
  ];

  const currentStepIndex = steps.findIndex(s => !s.completed) === -1 ? 5 : steps.findIndex(s => !s.completed);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative font-sans text-white overflow-hidden"
      style={{
        background: '#080b14',
        backgroundImage: 'radial-gradient(ellipse 60% 50% at 20% 10%, rgba(99,51,255,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(0,212,200,0.1) 0%, transparent 60%), linear-gradient(rgba(99,51,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,51,255,0.03) 1px, transparent 1px)',
        backgroundSize: 'auto, auto, 40px 40px, 40px 40px'
      }}
    >
      {/* Scroll Progress Indicator */}
      <motion.div 
        style={{ scaleX, transformOrigin: '0%' }} 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6333ff] to-[#06d6c7] z-[100]" 
      />

      <div className="flex max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 gap-12">
        {/* Step Indicator (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0 pt-20 sticky top-12 h-fit">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gray-800" />
            
            {/* Active Gradient Line */}
            <motion.div 
              className="absolute left-[11px] top-4 w-[2px] bg-gradient-to-b from-[#6333ff] to-[#06d6c7]"
              initial={{ height: "0%" }}
              animate={{ height: `${(currentStepIndex / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />

            <div className="space-y-12 relative z-10">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex || (currentStepIndex === 5 && idx === 4);
                const isCompleted = step.completed;
                return (
                  <div key={step.id} className="flex items-center gap-4 transition-all duration-300">
                    <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-[#06d6c7] shadow-[0_0_15px_rgba(6,214,199,0.5)]' : isActive ? 'bg-[#080b14] border-2 border-[#6333ff] shadow-[0_0_15px_rgba(99,51,255,0.5)]' : 'bg-[#080b14] border-2 border-gray-700'}`}>
                      {isCompleted && <Check className="w-3 h-3 text-black font-bold" />}
                    </div>
                    <span className={`text-sm tracking-wide transition-all ${isCompleted ? 'text-[#06d6c7]' : isActive ? 'text-white font-medium' : 'text-gray-500'}`}>
                      Step {step.id} — {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl min-w-0">
          {/* Header Area */}
          <div className="mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white hover:bg-white/5 active:scale-97 transition-all p-2 h-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="text-sm font-medium">
                <span className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">Dashboard</span>
                <span className="text-gray-600 mx-2">/</span>
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[#a78bfa]">Upload Content</motion.span>
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] mb-4 font-['Syne'] font-[800] leading-tight">
              {"Upload & Publish Content".split(" ").map((word, i) => (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  className="inline-block mr-3 tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, #fff 30%, #a78bfa 60%, #06d6c7)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-gray-400 tracking-wide font-light max-w-2xl"
            >
              Let AI optimize and distribute your content across platforms
            </motion.p>
          </div>

          <div className="space-y-8 pb-32">
            {/* SECTION 1 - FILE UPLOAD */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 backdrop-blur-[10px] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(99,51,255,0.1)]"
            >
              {!uploadedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  className={`relative rounded-[16px] p-12 text-center transition-all duration-300 cursor-pointer group ${
                    dragActive
                      ? "border-[2px] border-solid border-[#6333ff] bg-[rgba(99,51,255,0.08)] scale-[1.01]"
                      : "border-[2px] border-dashed border-[rgba(99,51,255,0.3)] bg-[rgba(99,51,255,0.03)]"
                  } hover:border-[#6333ff] hover:bg-[rgba(99,51,255,0.08)] hover:scale-[1.01]`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleChange}
                    className="hidden"
                    accept={ALLOWED_EXTENSIONS}
                  />
                  
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6333ff] to-[#06d6c7] p-[2px] mb-6 shadow-[#6333ff]/20 shadow-xl"
                    >
                      <div className="w-full h-full bg-[#080b14] rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white transition-transform duration-200 group-hover:scale-110" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-['Syne'] font-[600] text-white mb-2">
                      Drop your content here
                    </h3>
                    <p className="text-gray-400 mb-6 font-light">
                      Browse or drag & drop files
                    </p>
                    
                    <div className="pointer-events-auto">
                      <Button
                        type="button"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleBrowseClick();
                        }}
                        className="bg-gradient-to-r from-[#6333ff] to-[#06d6c7] text-white px-8 py-6 rounded-xl hover:shadow-[0_8px_30px_rgba(99,51,255,0.4)] transition-all duration-300 active:scale-97 transform font-medium text-lg leading-none hover:-translate-y-1"
                      >
                        Select File
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, cubicBezier: [0.34,1.56,0.64,1] }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[16px] bg-gradient-to-br from-[rgba(99,51,255,0.1)] to-[rgba(0,212,200,0.05)] border border-[rgba(255,255,255,0.08)] relative"
                >
                  <div className="w-24 h-24 rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-xl shrink-0 bg-[#080b14] flex items-center justify-center">
                    {uploadedFile.preview ? (
                      <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      getFileIcon(uploadedFile.file)
                    )}
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col justify-center">
                    <p className="text-white font-['Syne'] font-[600] text-[16px] truncate mb-1 pr-8">{uploadedFile.file.name}</p>
                    <p className="text-sm text-[rgba(180,180,220,0.5)] font-medium mb-3">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB • Uploading...</p>
                    {/* Progress Bar under file */}
                    <div className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#6333ff] to-[#06d6c7] rounded-full shadow-[0_0_10px_#06d6c7]"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalyzing(false);
                      setAnalysisComplete(false);
                      setProgress(0);
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full transition-all duration-300 hover:bg-[rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:text-red-400 group"
                  >
                    <motion.div whileHover={{ rotate: [-10, 10, -10, 0] }} transition={{ duration: 0.4 }}>
                      <X className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </motion.div>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* SECTION 2 - AI CAPTIONS */}
            {(analysisComplete || showAiCaptionChoice) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 backdrop-blur-[10px] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(99,51,255,0.1)] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(99,51,255,0.08) 0%, rgba(0,212,200,0.05) 100%)' }}
            >
              {/* Top border shimmer */}
              <div className="absolute top-0 left-0 right-0 h-[1px]">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-[200%] h-full bg-gradient-to-r from-transparent via-[#06d6c7] to-transparent"
                  />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-12 h-12 flex items-center justify-center">
                   {/* Conic Gradient border */}
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                     className="absolute inset-0 rounded-full"
                     style={{ background: 'conic-gradient(from 0deg, transparent, #6333ff, #06d6c7, transparent)', padding: '2px' }}
                   >
                     <div className="w-full h-full bg-[#080b14] rounded-full" />
                   </motion.div>
                   {/* Orbiting particles */}
                   <div className="absolute inset-[-8px] animate-[spin_6s_linear_infinite]">
                     <div className="w-1.5 h-1.5 bg-[#06d6c7] rounded-full absolute -top-1 left-1/2 shadow-[0_0_5px_#06d6c7]" />
                     <div className="w-1 h-1 bg-[#6333ff] rounded-full absolute bottom-1 right-[-2px] shadow-[0_0_5px_#6333ff]" />
                     <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 -left-1 shadow-[0_0_5px_white]" />
                   </div>
                   <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                     <Sparkles className="w-5 h-5 text-white relative z-10" />
                   </motion.div>
                </div>
                <h3 className="text-[28px] font-['Syne'] font-[700] text-transparent bg-clip-text bg-gradient-to-r from-white to-[#06d6c7]">
                  AI Caption Generation
                </h3>
              </div>

              {((analyzing && !analysisComplete && showAiCaptionChoice==false)) && (
                <div className="py-12 space-y-6">
                  <div className="flex items-center gap-2 text-xl font-['Syne'] text-[#a78bfa]">
                     Analyzing content <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                  </div>
                  {/* Shimmer skeleton */}
                  <div className="space-y-4">
                    <div className="w-full h-4 bg-gray-800 rounded-full relative overflow-hidden">
                       <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                    </div>
                  </div>
                </div>
              )}

              {showAiCaptionChoice && !generatingCaption && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleAiCaptionChoice(true)}
                    className="flex-1 bg-gradient-to-r from-[#6333ff] to-[#06d6c7] hover:shadow-[0_8px_30px_rgba(99,51,255,0.4)] hover:-translate-y-[2px] text-white py-6 rounded-xl transition-all duration-300 font-medium active:scale-97 group overflow-hidden relative"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Yes, Generate with AI
                       <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                  <Button
                    onClick={() => handleAiCaptionChoice(false)}
                    className="flex-1 bg-[rgba(255,255,255,0.05)] border border-white hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[2px] text-white py-6 rounded-xl transition-all duration-300 font-medium active:scale-97"
                  >
                    No, I'll Write Manually
                  </Button>
                </div>
              )}

              {generatingCaption && (
                <div className="py-12 space-y-6">
                  <div className="flex items-center gap-2 text-xl font-['Syne'] text-[#a78bfa]">
                     Crafting magic <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                  </div>
                  {/* Shimmer skeleton */}
                  <div className="space-y-4">
                    <div className="w-full h-4 bg-gray-800 rounded-full relative overflow-hidden">
                       <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                    </div>
                    <div className="w-5/6 h-4 bg-gray-800 rounded-full relative overflow-hidden">
                       <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                    </div>
                    <div className="w-3/4 h-4 bg-gray-800 rounded-full relative overflow-hidden">
                       <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
                    </div>
                  </div>
                </div>
              )}

              {!showAiCaptionChoice && !generatingCaption && (
                <div className="grid grid-cols-1 gap-6 mt-4">
                  <div className="group relative">
                    <label className="text-sm text-[#a78bfa] mb-2 font-medium flex items-center justify-between">
                       Caption
                       <button onClick={editingCaption ? saveCaption : startEditingCaption} className="text-gray-400 hover:text-[#a78bfa] transition-colors p-1 hover:scale-120">
                          {editingCaption ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4 group-hover:scale-125 transition-transform" />}
                       </button>
                    </label>
                    <div className={`rounded-xl bg-[rgba(255,255,255,0.03)] border transition-all duration-200 group-focus-within:border-[#6333ff] group-focus-within:shadow-[0_0_0_3px_rgba(99,51,255,0.15)] ${editingCaption ? 'border-[#6333ff] shadow-[0_0_0_3px_rgba(99,51,255,0.15)]' : 'border-[rgba(139,92,246,0.2)]'}`}>
                      {editingCaption ? (
                        <textarea
                          value={tempCaption}
                          onChange={(e) => setTempCaption(e.target.value)}
                          className="w-full bg-transparent p-4 min-h-[120px] text-white resize-none outline-none focus:ring-0 leading-relaxed font-light transition-shadow"
                          autoFocus
                          placeholder="Type your caption here..."
                        />
                      ) : (
                        <div className="p-4 min-h-[120px] text-white/90 leading-relaxed font-light relative">
                           {aiAnalysis.caption ? (
                             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>{aiAnalysis.caption}</motion.p>
                           ) : (
                             <span className="relative">
                               <span className="text-gray-500 italic opacity-0">Placeholder</span>
                               <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.2)] via-[rgba(6,214,199,0.2)] to-[rgba(139,92,246,0.2)] rounded" />
                             </span>
                           )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="text-sm text-[#06d6c7] mb-2 font-medium flex items-center justify-between">
                       Hashtags
                       <button onClick={editingHashtags ? saveHashtags : startEditingHashtags} className="text-gray-400 hover:text-[#06d6c7] transition-colors p-1 hover:scale-120">
                          {editingHashtags ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4 group-hover:scale-125 transition-transform" />}
                       </button>
                    </label>
                    <div className={`rounded-xl bg-[rgba(255,255,255,0.03)] border transition-all duration-200 p-4 group-focus-within:border-[#06d6c7] group-focus-within:shadow-[0_0_0_3px_rgba(6,214,199,0.15)] ${editingHashtags ? 'border-[#06d6c7] shadow-[0_0_0_3px_rgba(6,214,199,0.15)]' : 'border-[rgba(6,214,199,0.2)]'}`}>
                      {editingHashtags ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                             {aiAnalysis.hashtags.map((tag, i) => (
                               <span key={i} className="flex items-center gap-1 text-sm text-[#06d6c7] bg-[rgba(6,214,199,0.1)] border border-[rgba(6,214,199,0.3)] px-3 py-1.5 rounded-full">
                                 {tag}
                                 <button onClick={() => removeHashtag(i)} className="hover:text-red-400 ml-1"><X className="w-3 h-3 hover:scale-125 transition-transform" /></button>
                               </span>
                             ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newHashtag}
                              onChange={(e) => setNewHashtag(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                              className="flex-1 bg-[rgba(0,0,0,0.2)] border border-[rgba(6,214,199,0.3)] focus:border-[#06d6c7] rounded-lg px-3 py-2 text-white outline-none transition-colors focus:shadow-[0_0_0_3px_rgba(6,214,199,0.15)]"
                              placeholder="Add a hashtag..."
                            />
                            <Button onClick={addHashtag} className="bg-[rgba(6,214,199,0.1)] text-[#06d6c7] hover:bg-[#06d6c7] hover:text-white transition-colors">Add</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 min-h-[42px] items-center">
                           {aiAnalysis.hashtags.length > 0 ? aiAnalysis.hashtags.map((tag, i) => (
                             <span key={i} className="text-sm font-medium text-[#06d6c7] bg-[rgba(6,214,199,0.1)] px-3 py-1.5 rounded-full border border-[rgba(6,214,199,0.2)]">
                               {tag}
                             </span>
                           )) : <span className="text-gray-500 italic">No hashtags added...</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            )}

            {/* SECTION 3 - CHOOSE PLATFORMS */}
            {analysisComplete && (!showAiCaptionChoice) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 backdrop-blur-[10px] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(99,51,255,0.1)] group/section"
              >
                <h3 className="text-[28px] font-['Syne'] font-[700] text-white mb-6 flex items-center gap-3">
                  <Target className="w-7 h-7 text-[#06d6c7] transition-transform duration-500 group-hover/section:rotate-180 group-hover/section:scale-110" />
                  Choose Platforms
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.map((platform, i) => {
                    const Icon = platform.icon;
                    let platformHoverBorder = "hover:border-[rgba(255,255,255,0.2)]";
                    let platformColorClass = "";
                    let platformGlow = "";
                    
                    if(platform.name === 'Instagram') { platformHoverBorder = "hover:border-[rgba(225,48,108,0.4)]"; platformColorClass = "[#e1306c]"; platformGlow = "drop-shadow-[0_0_8px_#e1306c]"; }
                    if(platform.name === 'Facebook') { platformHoverBorder = "hover:border-[rgba(24,119,242,0.4)]"; platformColorClass = "[#1877f2]"; platformGlow = "drop-shadow-[0_0_8px_#1877f2]"; }
                    if(platform.name === 'YouTube') { platformHoverBorder = "hover:border-[rgba(255,0,0,0.3)]"; platformColorClass = "[#ff0000]"; platformGlow = "drop-shadow-[0_0_8px_#ff0000]"; }
                    if(platform.name === 'LinkedIn') { platformHoverBorder = "hover:border-[rgba(0,119,181,0.4)]"; platformColorClass = "[#0077b5]"; platformGlow = "drop-shadow-[0_0_8px_#0077b5]"; }
                    if(platform.name === 'Twitter') { platformHoverBorder = "hover:border-[rgba(29,161,242,0.4)]"; platformColorClass = "[#1da1f2]"; platformGlow = "drop-shadow-[0_0_8px_#1da1f2]"; }

                    return (
                      <motion.div
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => togglePlatform(platform.id)}
                        className={`group cursor-pointer rounded-[16px] p-5 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${platformHoverBorder} ${
                          platform.enabled
                            ? `bg-${platformColorClass}/10 border-${platformColorClass}/40`
                            : `bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]`
                        }`}
                        style={platform.enabled ? { borderColor: platformColorClass.replace('[','').replace(']','') + '66', backgroundColor: platformColorClass.replace('[','').replace(']','') + '1a' } : {}}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Icon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${platform.enabled ? `text-${platformColorClass} ${platformGlow}` : 'text-gray-400'}`} style={platform.enabled ? { color: platformColorClass.replace('[','').replace(']',''), filter: `drop-shadow(0 0 8px ${platformColorClass.replace('[','').replace(']','')})` } : {}} />
                          
                          {/* Custom Toggle Pill */}
                          <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${platform.enabled ? 'bg-[#6333ff]' : 'bg-[rgba(255,255,255,0.15)]'}`}>
                            <motion.div 
                              layout
                              className="absolute top-1 bottom-1 w-4 rounded-full bg-white shadow-md"
                              initial={false}
                              animate={{ left: platform.enabled ? "26px" : "4px" }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                        <h4 className="text-white font-medium text-lg mb-1">{platform.name}</h4>
                        <div className="flex items-center gap-1.5 text-sm text-[rgba(180,180,220,0.45)]">
                          <Clock className="w-3.5 h-3.5" />
                          {platform.recommendedTime}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* SECTION 4 - SCHEDULE & PUBLISH */}
            {analysisComplete && (!showAiCaptionChoice) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group/section bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 backdrop-blur-[10px] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(99,51,255,0.1)]"
              >
                <h3 className="text-[28px] font-['Syne'] font-[700] text-white mb-6 flex items-center gap-3">
                  <motion.div whileInView={{ y: [0, -6, 0] }} transition={{ duration: 0.8, ease: "easeInOut" }} viewport={{ once: false, margin: "0px" }}>
                    <Calendar className="w-7 h-7 text-[#6333ff]" />
                  </motion.div>
                  Schedule & Publish
                </h3>

                {/* Ad Preview Section */}
                <div className="mb-8 relative rounded-[12px] p-[2px] overflow-hidden group">
                   {/* Animated Gradient Border */}
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(99,51,255,0.4),rgba(6,214,199,0.4),transparent)] -z-10" />
                   <div className="bg-[#080b14] border border-dashed border-[rgba(255,255,255,0.1)] rounded-[10px] p-6 z-10 relative">
                     {previewImage ? (
                       <div className="space-y-4">
                         <div className="relative rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)] group/img h-48">
                           <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                           <button onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 backdrop-blur text-white p-1.5 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center group-hover:-translate-y-[2px] transition-transform duration-300 relative group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-gradient-to-r group-hover:after:from-[#6333ff]/20 group-hover:after:to-[#06d6c7]/20 group-hover:after:blur-xl group-hover:after:-z-10">
                         <Button onClick={handlePreviewImageClick} className="w-full bg-gradient-to-r from-[#6333ff] to-[#06d6c7] hover:shadow-[0_8px_30px_rgba(99,51,255,0.3)] text-white py-5 rounded-lg active:scale-97 font-medium text-base h-auto group/btn">
                           <ImageIcon className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                           Select Preview Image
                         </Button>
                         <p className="text-sm text-gray-500 pt-3">Custom thumbnail for social media preview (Optional)</p>
                       </div>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 font-medium flex items-center group-focus-within:text-[#a78bfa] transition-colors">Date</label>
                    <div className="relative group/input">
                      <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] focus:border-[#a78bfa] focus:shadow-[0_0_0_3px_rgba(99,51,255,0.15)] rounded-xl px-4 py-3 text-white outline-none transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 font-medium flex items-center group-focus-within:text-[#a78bfa] transition-colors">Time</label>
                    <div className="relative group/input">
                      <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] focus:border-[#a78bfa] focus:shadow-[0_0_0_3px_rgba(99,51,255,0.15)] rounded-xl px-4 py-3 text-white outline-none transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1 relative overflow-hidden group bg-gradient-to-br from-[#06b6d4] to-[#6333ff] hover:shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 text-white py-6 rounded-xl transition-all duration-300 font-medium text-lg active:scale-97"
                    onClick={(e) => {
                       const r = document.createElement("span");
                       r.className = "absolute bg-white/30 rounded-full animate-[ping_0.6s_cubic-bezier(0,0,0.2,1)_1]";
                       r.style.width = r.style.height = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight) + "px";
                       r.style.left = e.clientX - e.currentTarget.getBoundingClientRect().left - parseInt(r.style.width)/2 + "px";
                       r.style.top = e.clientY - e.currentTarget.getBoundingClientRect().top - parseInt(r.style.height)/2 + "px";
                       e.currentTarget.appendChild(r);
                       setTimeout(() => r.remove(), 600);
                       
                       const adCreativeData = { caption: aiAnalysis.caption, hashtags: aiAnalysis.hashtags, platforms: platforms.filter(p=>p.enabled).map(p=>p.name) };
                       localStorage.setItem("adCreativeData", JSON.stringify(adCreativeData));
                       setTimeout(() => navigate("/create-ad"), 300);
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       Publish Now
                      <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ease-out" />
                    </span>
                  </Button>
                  
                  <Button 
                    className="flex-1 group bg-gradient-to-br from-[#7c3aed] to-[#ec4899] hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 text-white py-6 rounded-xl transition-all duration-300 font-medium text-lg active:scale-97"
                  >
                    <Clock className="w-5 h-5 mr-2 group-hover:rotate-[360deg] transition-transform duration-[600ms]" />
                    Schedule Post
                  </Button>
                </div>
              </motion.div>
            )}

            {/* SECTION 5 - SUMMARY */}
            {analysisComplete && (!showAiCaptionChoice) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 backdrop-blur-[10px] transition-all duration-300 hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(99,51,255,0.1)] relative overflow-hidden group/summary"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6333ff] opacity-[0.03] rounded-full blur-3xl" />
                <h3 className="text-[28px] font-['Syne'] font-[700] text-white mb-8 flex items-center gap-3">
                  <motion.div animate={{ color: ["#6333ff", "#06d6c7", "#ec4899", "#6333ff"] }} transition={{ repeat: Infinity, duration: 4 }}>
                    <Sparkles className="w-7 h-7" />
                  </motion.div>
                  Campaign Summary
                </h3>

                <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                  {/* Floating Image Preview */}
                  <motion.div 
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-48 h-48 shrink-0 rounded-[16px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_65px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] bg-[#080b14]"
                  >
                    {uploadedFile?.preview && (
                      uploadedFile.file.type.startsWith('video/') ? (
                        <video src={uploadedFile.preview} className="w-full h-full object-cover pointer-events-none" muted />
                      ) : (
                        <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
                      )
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0 w-full space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Target Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {enabledPlatforms.map((p, i) => {
                           let platformColorClass = "";
                           if(p.name === 'Instagram') platformColorClass = "[#e1306c]";
                           else if(p.name === 'Facebook') platformColorClass = "[#1877f2]";
                           else if(p.name === 'YouTube') platformColorClass = "[#ff0000]";
                           else if(p.name === 'LinkedIn') platformColorClass = "[#0077b5]";
                           else if(p.name === 'Twitter') platformColorClass = "[#1da1f2]";
                           return (
                             <motion.div 
                               key={p.name}
                               initial={{ opacity: 0, y: 30 }}
                               whileInView={{ opacity: 1, y: 0 }}
                               viewport={{ once: true }}
                               transition={{ delay: i * 0.1, type: "spring" }}
                               className={`px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-300 hover:brightness-125
                               ${platformColorClass ? `bg-${platformColorClass}/15 text-${platformColorClass}` : ''}`}
                               style={platformColorClass ? { backgroundColor: platformColorClass.replace('[','').replace(']','') + '26', color: platformColorClass.replace('[','').replace(']','') } : {}}
                             >
                                {p.name}
                             </motion.div>
                           )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group/card bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#6333ff]/50 hover:shadow-[0_0_20px_rgba(99,51,255,0.15)] flex flex-col items-center justify-center text-center">
                    <Users className="w-6 h-6 text-[#06d6c7] mb-2 group-hover/card:scale-110 transition-transform" />
                    <div className="text-sm text-gray-400 mb-1">Est. Reach</div>
                    <div className="text-2xl font-bold text-white font-['Syne'] tracking-wider">
                      <motion.span 
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 1 }}
                         onAnimationStart={(e: any) => {
                           if(e === "visible" || e?.opacity === 1) {
                              const el = document.getElementById("est-reach-num");
                              if(el) {
                                 const final = estimatedReach;
                                 let start = 0;
                                 const int = setInterval(() => {
                                   start += Math.ceil(final / 20);
                                   if(start >= final) { start = final; clearInterval(int); }
                                   el.innerText = start.toLocaleString();
                                 }, 50);
                              }
                           }
                         }}
                      ><span id="est-reach-num">{estimatedReach.toLocaleString()}</span></motion.span>
                    </div>
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="group/card bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#6333ff]/50 hover:shadow-[0_0_20px_rgba(99,51,255,0.15)] flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-6 h-6 text-[#a78bfa] mb-2 group-hover/card:scale-110 transition-transform" />
                    <div className="text-sm text-gray-400 mb-2">AI Score</div>
                    <div className="w-full flex items-center justify-center gap-3">
                      <div className="flex-1 max-w-[120px] h-2 bg-gray-800 rounded-full overflow-hidden relative">
                        <motion.div className="h-full bg-gradient-to-r from-[#6333ff] to-[#06d6c7] rounded-full" initial={{ width: 0 }} whileInView={{ width: `${aiScore}%` }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} />
                        <motion.div className="absolute top-0 bottom-0 left-0 w-8 bg-white/30 blur" animate={{ x: ["-100px", "200px"] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }} />
                      </div>
                      <span className="text-xl font-bold text-white font-['Syne']">{aiScore}/100</span>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="group/card bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#6333ff]/50 hover:shadow-[0_0_20px_rgba(99,51,255,0.15)] flex flex-col items-center justify-center text-center">
                    <DollarSign className="w-6 h-6 text-[#34d399] mb-2 group-hover/card:scale-110 transition-transform" />
                    <div className="text-sm text-gray-400 mb-2">Cost</div>
                    <div className="px-3 py-1 bg-[rgba(16,185,129,0.15)] text-[#34d399] rounded-full text-sm font-semibold tracking-wide">
                      Free
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
'''

new_file = logic + '\n' + jsx
with open('e:/vulpinix-remix/Vulpinix/src/pages/UploadPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_file)
