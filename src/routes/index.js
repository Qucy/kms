import Image from '../pages/image/image'
import Document from '../pages/document/document'
import Tag from '../pages/tag/tag'

const routes = [
    {
      path: '/image',
      element: <Image />
    },
    {
      path: '/document',
      element: <Document />
    },
    {
      path: '/tag',
      element: <Tag />
    },
  ]

  export default routes;