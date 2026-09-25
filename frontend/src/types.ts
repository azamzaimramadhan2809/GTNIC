export interface Product {
  id: number
  name: string
  desc: string
  price: string
  badge?: string | null
  img: string
}

export interface Feature {
  icon: string        // emoji
  title: string
  desc: string
}

export interface Step {
  number: string      // "01" "02" etc.
  title: string
  desc: string
}

export interface Testimonial {
  name: string
  role: string
  location: string
  text: string
  metric: string
  rating: number
}
