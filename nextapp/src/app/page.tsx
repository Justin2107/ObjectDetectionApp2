'use client'

import { useState } from 'react'
import { Search, ArrowLeft, ArrowRight } from 'lucide-react'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchResult {
  imageUrl: string;
  title: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentIndex, setCurrentIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}&index=${currentIndex}`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1)
    handleSearch(new Event('submit') as any)
  }

  const handlePrevious = () => {
    if (currentIndex > 1) {
      setCurrentIndex(prev => prev - 1)
      handleSearch(new Event('submit') as any)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Flickr Image Search
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 mb-4 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Image Display */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Search Result</CardTitle>
              <CardDescription>
                Showing result {currentIndex} for "{searchTerm}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={result.imageUrl} 
                  alt={result.title || 'Search result'}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex <= 1 || loading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}