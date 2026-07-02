"use client"

import { useState, useEffect } from "react"
import { Folder, Image as ImageIcon, Plus, Search, Trash2, Copy, Eye, ArrowUpCircle } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  url: string
  folder: string
  size: string
  createdAt: string
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([
    {
      id: "1",
      name: "serverless_cache.png",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
      folder: "Architectures",
      size: "245 KB",
      createdAt: "Jul 2, 2026",
    },
    {
      id: "2",
      name: "tailwind_layout.png",
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
      folder: "Designs",
      size: "182 KB",
      createdAt: "Jul 2, 2026",
    },
    {
      id: "3",
      name: "workspace_developer.png",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
      folder: "General",
      size: "310 KB",
      createdAt: "Jul 1, 2026",
    },
  ])

  const [folders, setFolders] = useState<string[]>(["All", "Architectures", "Designs", "General"])
  const [activeFolder, setActiveFolder] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  
  // Custom states
  const [newFolderName, setNewFolderName] = useState("")
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("cms_media_library")
    const savedFolders = localStorage.getItem("cms_media_folders")
    if (saved) setItems(JSON.parse(saved))
    if (savedFolders) setFolders(JSON.parse(savedFolders))
  }, [])

  const syncStore = (nextItems: MediaItem[], nextFolders = folders) => {
    setItems(nextItems)
    setFolders(nextFolders)
    localStorage.setItem("cms_media_library", JSON.stringify(nextItems))
    localStorage.setItem("cms_media_folders", JSON.stringify(nextFolders))
  }

  // Handle mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Url = event.target?.result as string
        const sizeStr = `${Math.ceil(file.size / 1024)} KB`
        const newItem: MediaItem = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          url: base64Url,
          folder: activeFolder === "All" ? "General" : activeFolder,
          size: sizeStr,
          createdAt: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        }
        const nextItems = [newItem, ...items]
        syncStore(nextItems)
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle folder addition
  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const formatted = newFolderName.trim()
    if (folders.includes(formatted)) return

    const nextFolders = [...folders, formatted]
    syncStore(items, nextFolders)
    setNewFolderName("")
    setShowFolderForm(false)
    setActiveFolder(formatted)
  }

  // Handle delete item
  const handleDeleteItem = (id: string) => {
    if (selectedItem?.id === id) setSelectedItem(null)
    const nextItems = items.filter((item) => item.id !== id)
    syncStore(nextItems)
  }

  // Copy item URL
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopyStatus(id)
    setTimeout(() => setCopyStatus(null), 2000)
  }

  // Filtering calculations
  const filteredItems = items.filter((item) => {
    const matchesFolder = activeFolder === "All" || item.folder === activeFolder
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 glass rounded-2xl border border-card-border bg-card shadow-xl min-h-[500px]">
      
      {/* LEFT COLUMN: Folders and Upload */}
      <div className="w-full md:w-52 shrink-0 flex flex-col gap-4">
        
        {/* Upload Input button */}
        <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-lg shadow-primary/20 select-none">
          <ArrowUpCircle className="w-4 h-4" />
          <span>Upload Image</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <div className="h-px bg-card-border/40 my-1" />

        {/* Folders navigation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted uppercase px-2 mb-1">
            <span>Folders</span>
            <button
              onClick={() => setShowFolderForm(!showFolderForm)}
              className="p-0.5 rounded text-muted hover:text-foreground cursor-pointer hover:bg-background/80"
              title="Create new folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showFolderForm && (
            <form onSubmit={handleAddFolder} className="flex gap-1.5 px-2 mb-2">
              <input
                required
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="flex-1 bg-background border border-card-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-primary-hover"
              >
                Add
              </button>
            </form>
          )}

          {folders.map((fold) => {
            const isActive = activeFolder === fold
            return (
              <button
                key={fold}
                onClick={() => {
                  setActiveFolder(fold)
                  setSelectedItem(null)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold select-none cursor-pointer transition-all ${
                  isActive
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "border border-transparent text-muted hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted"}`} />
                <span className="truncate">{fold}</span>
              </button>
            )
          })}
        </div>

      </div>

      {/* CENTER COLUMN: Files Grid view */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        
        {/* Search header */}
        <div className="relative w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-card-border rounded-xl text-foreground text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all font-sans"
          />
        </div>

        {/* Media Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[420px] p-1 border border-card-border/40 rounded-xl bg-background/30">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/5"
                      : "border-card-border/60 hover:border-card-border hover:bg-card/40 bg-card/10"
                  }`}
                >
                  
                  {/* Image Aspect ratio box */}
                  <div className="aspect-video bg-background/50 flex items-center justify-center overflow-hidden border-b border-card-border/40 relative">
                    {item.url.startsWith("http") || item.url.startsWith("data:image") ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted/30" />
                    )}
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItem(item)
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Preview Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyUrl(item.url, item.id)
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Copy image source URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteItem(item.id)
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 transition-colors cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata bottom row */}
                  <div className="p-2.5 flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground truncate block leading-snug">
                      {item.name}
                    </span>
                    <div className="flex justify-between items-center text-[9px] font-mono text-muted">
                      <span>{item.size}</span>
                      <span>{item.folder}</span>
                    </div>
                  </div>

                </div>
              )
            })
          ) : (
            <div className="col-span-full py-16 text-center text-xs text-muted font-sans flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8 opacity-20" />
              No images matched the folder or search filters.
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Selection detail panel */}
      {selectedItem && (
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-4 border border-card-border/60 bg-background/40 p-4 rounded-xl relative self-start">
          <div className="text-[10px] font-mono font-bold text-muted uppercase">Image Preview</div>
          
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-card-border p-0.5 bg-background">
            <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-cover rounded" />
          </div>

          <div className="flex flex-col gap-2 font-mono text-[10px] text-muted truncate">
            <div>Name: <span className="text-foreground block truncate font-sans font-semibold text-xs mt-0.5">{selectedItem.name}</span></div>
            <div>Folder: <span className="text-foreground block truncate mt-0.5">{selectedItem.folder}</span></div>
            <div>Size: <span className="text-foreground block truncate mt-0.5">{selectedItem.size}</span></div>
            <div>Uploaded: <span className="text-foreground block truncate mt-0.5">{selectedItem.createdAt}</span></div>
          </div>

          <div className="h-px bg-card-border/40 my-1" />

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copyStatus === selectedItem.id ? "Copied!" : "Copy Source URL"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteItem(selectedItem.id)}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-red-950/20 border border-red-500/20 hover:bg-red-900/30 text-red-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Asset</span>
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
