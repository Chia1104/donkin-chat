import { Michroma, Noto_Sans, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';

export const AvenirNextLTPro_Regular = localFont({ src: './fonts/AvenirNextLTPro_Regular.otf' });

export const michroma = Michroma({ weight: '400', subsets: ['latin'] });

export const noto_sans = Noto_Sans({ weight: '300', subsets: ['latin'] });

export const montserrat = Montserrat({ subsets: ['latin'] });
