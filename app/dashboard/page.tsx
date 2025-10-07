'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Note {
  id: number
  title: string
  content: string
  created_at: string
}

interface User {
  id: number
  username: string
  profile_picture?: string
}

function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, content: string) => void
  initialData?: { title: string; content: string }
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-gray-600">{initialData ? 'Edit Note' : 'Create Note'}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(title, content)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{ id?: number; title: string; content: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    fetchNotes(parsedUser.id)
    fetchUserProfile(parsedUser.id)
  }, [router])

  const fetchNotes = async (userId: number) => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await fetch(`/api/users?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const createNote = () => {
    setModalData(null)
    setIsModalOpen(true)
  }

  const updateNote = (note: Note) => {
    setModalData(note)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (title: string, content: string) => {
    setIsModalOpen(false)

    if (modalData) {
      // Update existing note
      try {
        const response = await fetch(`/api/notes/${modalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        })

        const data = await response.json()

        if (response.ok) {
          setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === modalData.id ? { ...note, title, content } : note))
          )
        } else {
          alert(data.error)
        }
      } catch (error) {
        console.error('Error updating note:', error)
      }
    } else {
      // Create new note
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, title, content }),
        })

        const data = await response.json()

        if (response.ok) {
          setNotes((prevNotes) => [data.note, ...prevNotes])
        } else {
          alert(data.error)
        }
      } catch (error) {
        console.error('Error creating note:', error)
      }
    }
  }

  const deleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
      } else {
        const data = await response.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-gray-700">Welcome, {user?.username}</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={createNote}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mb-4"
        >
          Create Note
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {note.title.length > 50 ? `${note.title.slice(0, 50)}...` : note.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
              </p>
              <div className="mt-4 text-xs text-gray-500">
                {new Date(note.created_at).toLocaleDateString()}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => updateNote(note)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes yet. Create your first note!</p>
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalData || undefined}
      />
    </div>
  )
}