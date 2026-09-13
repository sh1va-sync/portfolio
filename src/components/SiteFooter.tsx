import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Now', href: '/now' },
  { label: 'Contact', href: '/contact' },
] as const

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} Shiva Chary</span>
          <nav aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} to={link.href} data-cursor="hover">{link.label}</Link>
            ))}
          </nav>
          <a href="#top" data-cursor="hover">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
