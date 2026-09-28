import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle2, LogOut, ClipboardList, Store, LayoutDashboard } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuthStore } from '@/stores/authStore'
import axiosClient from '@/services/axiosClient'

export default function AccountMenu() {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function go(path) {
        setOpen(false)
        navigate(path)
    }

    async function handleLogout() {
        setOpen(false)
        try {
            await axiosClient.post('/auth/logout')
        } catch {
            // ignore — proceed with client-side logout regardless
        }
        logout()
        navigate('/login')
    }

    const menuItems = {
        customer: [
            { label: 'My Orders', icon: ClipboardList, path: '/account/orders' },
            { label: 'Favorites', icon: Store, path: '/favorites' },
        ],
        farmer: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/farmer' },
            { label: 'My Products', icon: Store, path: '/farmer/products' },
            { label: 'Orders', icon: ClipboardList, path: '/farmer/orders' },
        ],
        admin: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        ],
    }[user?.role] || []

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-full hover:ring-2 hover:ring-forest/20 transition-all"
                aria-label="Account menu"
            >
                <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-line bg-surface-cream shadow-lg py-1.5 z-50">
                    <div className="px-3.5 py-2.5 border-b border-line/60">
                        <p className="text-sm font-medium text-text-main truncate">{user?.name}</p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{user?.email}</p>
                    </div>

                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => go(item.path)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-main hover:bg-bg-ivory transition-colors"
                        >
                            <item.icon className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
                            {item.label}
                        </button>
                    ))}

                    {user?.role !== 'admin' && (
                        <button
                            type="button"
                            onClick={() => go(user?.role === 'customer' ? '/account/profile' : `/${user?.role}/profile`)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-main hover:bg-bg-ivory transition-colors"
                        >
                            <UserCircle2 className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />
                            My Profile
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-error hover:bg-error/5 border-t border-line/60 mt-1 pt-2"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.75} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}