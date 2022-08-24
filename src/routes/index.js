import Image from '../pages/image/image';
import Document from '../pages/document/document';
import Tag from '../pages/tag/tag';
import Campaign from '../pages/campaign/Campaign';

const routes = [
  {
    path: '/image',
    element: <Image />,
  },
  {
    path: '/document',
    element: <Document />,
  },
  {
    path: '/tag',
    element: <Tag />,
  },
  {
    path: '/campaign',
    element: <Campaign />,
  },
];

export default routes;
