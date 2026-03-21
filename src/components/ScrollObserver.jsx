import { useEffect, useRef } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'
import { sectionOrder } from '../config/sectionPresets'

export default function ScrollObserver() {
    const setSection = usePortfolioStore((s) => s.setSection)
    const observerRef = useRef(null)

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0,
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id
                    if (sectionOrder.includes(id)) {
                        setSection(id)
                    }
                }
            })
        }, options)

        sectionOrder.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observerRef.current.observe(el)
        })

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [setSection])

    return null
}
