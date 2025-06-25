import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg">SpyroSigma</h3>
            <p className="text-sm text-muted-foreground mt-1">Building innovative solutions</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
              <Link href="https://spyrosigma.tech" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                Portfolio
              </Link>
              <Link href="/about" className="text-sm hover:underline">
                About
              </Link>
              <Link href="/contact" className="text-sm hover:underline">
                Contact
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SpyroSigma. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}   