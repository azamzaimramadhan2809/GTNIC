import { useState, useRef, useLayoutEffect, Suspense, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Html } from '@react-three/drei'
import { useMotionValueEvent, MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { CheckCircle2, Plus } from 'lucide-react'
import type { Product } from '../types'

// ─── 3D Model Path ─────────────────────────────────────────────────────────────
const MODEL_PATH = '/models/source/apple_iphone_18_pro_max_burgundy.glb'

// ─── Props ─────────────────────────────────────────────────────────────────────
export interface PhoneFrameProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  rotateYRad?: MotionValue<number>
  rotateXRad?: MotionValue<number>
}

// ─── Static Product Data ───────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Es Kopi Susu Aren',
    desc: 'Espresso blend + gula aren organik',
    price: 'Rp 18.000',
    badge: 'Terlaris',
    img: 'https://images.unsplash.com/photo-1516195700843-20a1d5e93d2d?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Matcha Oat Latte',
    desc: 'Uji Matcha murni + Oat milk premium',
    price: 'Rp 24.000',
    badge: null,
    img: 'https://images.unsplash.com/photo-1632862293234-ba7895580fde?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Butter Croissant',
    desc: 'Renyah renyah flaky butter asli Prancis',
    price: 'Rp 22.000',
    badge: 'Fresh',
    img: 'https://images.unsplash.com/photo-1604137762918-ca0896aa2b37?w=100&h=100&fit=crop',
  },
  {
    id: 4,
    name: 'Americano Ice',
    desc: 'Single origin Arabica segar & bold',
    price: 'Rp 16.000',
    badge: null,
    img: 'https://images.unsplash.com/photo-1710732652617-264d6f860546?w=100&h=100&fit=crop',
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// STORE SCREEN UI (Rendered directly inside Drei <Html transform>)
// Designed at 340px x 720px with 42px corner radius to match iPhone bezel.
// ──────────────────────────────────────────────────────────────────────────────
function StoreScreenUI({
  currentTab,
  onTabClick,
}: {
  currentTab: string
  onTabClick: (tab: string) => void
}) {
  const TABS = ['Semua Menu', 'Kopi', 'Pastry', 'Non-Kopi']

  return (
    <div
      className="w-[340px] h-[720px] rounded-[42px] overflow-hidden shadow-none border-none pointer-events-auto"
      style={{
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* Glossy screen glass gradient reflection */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />

      {/* ① iOS Status Bar with Time & Icons */}
      <div
        style={{
          height: 44,
          padding: '0 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: '#09090b', letterSpacing: -0.2 }}>9:41</span>
        {/* Dynamic Island pill */}
        <div
          style={{
            width: 108,
            height: 28,
            borderRadius: 999,
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#18181b', border: '1.5px solid #27272a' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle, #38bdf8 30%, #0369a1 100%)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 15, height: 9, borderRadius: 2, border: '1px solid #09090b', padding: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '80%', height: '100%', background: '#09090b', borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* ② Store Brand Header */}
      <div style={{ padding: '8px 20px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1516195700843-20a1d5e93d2d?w=120&h=120&fit=crop"
              alt="Store Logo"
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                objectFit: 'cover',
                border: '1.5px solid #f4f4f5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            />
            <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }} />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#09090b', letterSpacing: -0.3 }}>Kopi Senja Utama</span>
              <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} fill="#10b981" strokeWidth={0} />
            </div>
            <div style={{ fontSize: 11, color: '#71717a', fontWeight: 500, marginTop: 1 }}>
              lynkstore.id/kopi-senja
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: 99, padding: '3px 10px' }}>
            ⭐ 4.9 (128 ulasan)
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: 99, padding: '3px 10px' }}>
            Buka · Pengiriman Cepat
          </span>
        </div>
      </div>

      {/* ③ Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 20px 10px', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            style={{
              borderRadius: 99,
              padding: '6px 14px',
              fontSize: 11.5,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: currentTab === tab ? '#09090b' : '#f4f4f5',
              color: currentTab === tab ? '#ffffff' : '#71717a',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ④ Product List */}
      <div style={{ flex: 1, overflowY: 'hidden', padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PRODUCTS.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 18,
              background: '#fcfcfc',
              border: '1px solid #f4f4f5',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                objectFit: 'cover',
                background: '#f4f4f5',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </span>
                {item.badge && (
                  <span style={{ fontSize: 8.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, background: '#dcfce7', color: '#15803d', borderRadius: 6, padding: '1px 5px', flexShrink: 0 }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10.5, color: '#71717a', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.desc}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#09090b', marginTop: 3 }}>
                {item.price}
              </div>
            </div>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#09090b',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>

      {/* ⑤ Sticky WhatsApp Checkout CTA */}
      <div style={{ padding: '8px 18px 10px', flexShrink: 0 }}>
        <div
          style={{
            borderRadius: 20,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(5,150,105,0.28)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              2
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Order via WhatsApp
              </div>
              <div style={{ fontSize: 10, color: 'rgba(209,250,229,0.9)', fontWeight: 600 }}>
                Rp 42.000 (2 Item)
              </div>
            </div>
          </div>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 800,
              color: '#047857',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            Checkout →
          </div>
        </div>

        {/* iOS Home Indicator Bar */}
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 99,
            background: '#09090b',
            margin: '10px auto 2px',
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// 3D IPHONE MODEL WITH EMBEDDED DREI <Html transform>
// Perfectly locks the 2D UI to the 3D phone screen geometry in world space!
// ──────────────────────────────────────────────────────────────────────────────
interface IPhoneModelProps {
  rotateYRad?: MotionValue<number>
  rotateXRad?: MotionValue<number>
  currentTab: string
  onTabClick: (tab: string) => void
}

const IPhoneModel = memo(function IPhoneModel({
  rotateYRad,
  rotateXRad,
  currentTab,
  onTabClick,
}: IPhoneModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const gltf = useGLTF(MODEL_PATH)

  const fallbackY = useRef(new MotionValue(-0.6))
  const fallbackX = useRef(new MotionValue(0.25))

  // Sanitize materials and style Front_Screen
  useLayoutEffect(() => {
    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = false
      mesh.receiveShadow = false

      // Style Front_Screen as deep sleek OLED glass
      if (mesh.name === 'Front_Screen') {
        mesh.visible = true
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.color = new THREE.Color('#09090b')
          mat.roughness = 0.15
          mat.metalness = 0.1
        }
      }
    })
  }, [gltf.scene])

  // Bind rotation directly to meshRef without triggering React re-renders
  useMotionValueEvent(rotateYRad ?? fallbackY.current, 'change', (latest) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = latest
    }
  })

  useMotionValueEvent(rotateXRad ?? fallbackX.current, 'change', (latest) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = latest
    }
  })

  useFrame(() => {
    if (!meshRef.current) return
    if (rotateYRad) meshRef.current.rotation.y = rotateYRad.get()
    if (rotateXRad) meshRef.current.rotation.x = rotateXRad.get()
  })

  return (
    <group ref={meshRef} dispose={null}>
      {/* 3D Phone Chassis centered around [0, 0, 0] */}
      <primitive
        object={gltf.scene}
        scale={16.5}
        position={[0, -1.347, -0.023]}
      />

      {/* Front Screen UI locked to screen geometry */}
      <Html
        transform
        position={[-0.05, 0, 0.08]}
        rotation={[0, 0, 0]}
        distanceFactor={1.15}
        zIndexRange={[90, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <StoreScreenUI currentTab={currentTab} onTabClick={onTabClick} />
      </Html>
    </group>
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED PHONE FRAME
// ──────────────────────────────────────────────────────────────────────────────
export default function PhoneFrame({
  activeTab,
  onTabChange,
  rotateYRad,
  rotateXRad,
}: PhoneFrameProps) {
  const [active, setActive] = useState('Semua Menu')

  const currentTab = activeTab !== undefined ? activeTab : active
  const handleTabClick = (tab: string) => {
    setActive(tab)
    onTabChange?.(tab)
  }

  return (
    <div
      className="relative z-0 select-none flex items-center justify-center"
      style={{ width: 420, height: 750, touchAction: 'pan-y', isolation: 'isolate' }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 35 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
      >
        {/* Studio Lighting with realistic key, fill, and rim highlights */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 8, 8]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[-6, -2, 4]} intensity={1.5} color="#f8fafc" />
        <directionalLight position={[0, 6, -6]} intensity={1.2} color="#38bdf8" />
        <directionalLight position={[0, -6, 2]} intensity={0.8} color="#fef3c7" />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <IPhoneModel
            rotateYRad={rotateYRad}
            rotateXRad={rotateXRad}
            currentTab={currentTab}
            onTabClick={handleTabClick}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
