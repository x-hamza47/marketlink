import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle2, LogOut, ChevronDown } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function AccountMenu() {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    // Close on outside click.
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function goToProfile() {
        setOpen(false)
        navigate(`/${user?.role}/profile`)
    }

    function handleLogout() {
        setOpen(false)
        logout()
        navigate('/login')
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md p-1 pr-1.5 hover:bg-bg-ivory transition-colors"
                aria-label="Account menu"
            >
                <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
                <ChevronDown
                    className={cn('w-3.5 h-3.5 text-text-secondary transition-transform', open && 'rotate-180')}
                    strokeWidth={2}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-line bg-surface-cream shadow-lg py-1.5 z-50">
                    <div className="px-3.5 py-2.5 border-b border-line/60">
                        <p className="text-sm font-medium text-text-main truncate">{user?.name}</p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{user?.email}</p>
                    </div>

                    <button
                        type="button"
                        onClick={goToProfile}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-main hover:bg-bg-ivory transition-colors"
                    >
                        <UserCircle2 className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
                        My Profile
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-error hover:bg-error/5 transition-colors"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.75} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}