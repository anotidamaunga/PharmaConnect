import * as React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface IconProps {
    style?: ViewStyle;
    width?: number;
    height?: number;
    color?: string;
    onPress?: () => void;
}

export const UserCircleIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975M15 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);

export const CogIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.004.827c-.292.24-.437.613-.43.992a6.759 6.759 0 0 1 0 1.905c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.905c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.333-.183.582-.495.644-.869l.213-1.28Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </Svg>
);

export const HomeIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </Svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-4.098m16.5 0a2.25 2.25 0 0 0-2.25-2.25h-12a2.25 2.25 0 0 0-2.25 2.25m16.5 0v-4.098a2.25 2.25 0 0 0-2.25-2.25h-12a2.25 2.25 0 0 0-2.25 2.25v4.098" />
    </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </Svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);

export const StarIcon: React.FC<IconProps & { fill?: string }> = ({ style, width = 24, height = 24, color = "currentColor", onPress, fill = color }) => (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={fill} style={style} onPress={onPress}>
        <Path fillRule="evenodd" d="M10.868 2.884c.321-.962 1.615-.962 1.936 0l1.838 5.514a1 1 0 0 0 .95.69h5.811c1.02.002 1.442 1.312.693 1.957l-4.703 3.414a1 1 0 0 0-.364 1.118l1.838 5.514c.321.962-.784 1.79-1.574 1.224l-4.703-3.414a1 1 0 0 0-1.175 0l-4.703 3.414c-.79.566-1.895-.262-1.574-1.224l1.838-5.514a1 1 0 0 0-.364-1.118L2.01 10.998c-.749-.645-.327-1.955.693-1.957h5.811a1 1 0 0 0 .95-.69L10.868 2.884Z" clipRule="evenodd" />
    </Svg>
);

export const BuildingStorefrontIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0 1 14.25 12h.5a.75.75 0 0 1 .75.75V21m-4.5 0v-7.5A.75.75 0 0 1 10.5 12h.5a.75.75 0 0 1 .75.75V21m-4.5 0V15a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75V21m-4.5 0V18a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v3.75m-7.5 0V12A2.25 2.25 0 0 1 5.25 9.75h13.5A2.25 2.25 0 0 1 21 12v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 21Z" />
    </Svg>
);

export const ExclamationCircleIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </Svg>
);

export const MegaphoneIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" stroke={color} style={style} strokeWidth={1.5}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </Svg>
);

export const DocumentArrowUpIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </Svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m-1.5 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </Svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </Svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </Svg>
);

export const PencilIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </Svg>
);

export const ArrowRightOnRectangleIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H21" />
    </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);

export const CheckBadgeIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </Svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </Svg>
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 0 1-3.646-1.072L9.75 15.75m0 0v3.375c0 .621-.504 1.125-1.125 1.125H4.5A2.25 2.25 0 0 1 2.25 18V7.5a2.25 2.25 0 0 1 2.25-2.25h5.375c.621 0 1.125.504 1.125 1.125v1.652M16.5 18.375V16.5m0 1.875a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z" />
    </Svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </Svg>
);

export const EyeIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </Svg>
);

export const HeartIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </Svg>
);

export const HeartSolidIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} style={style}>
        <Path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.632 19.51 6.115 17.25 4.354 15.356a5.25 5.25 0 0 1 0-7.424 5.25 5.25 0 0 1 7.424 0L12 8.16l.222-.222a5.25 5.25 0 0 1 7.424 0 5.25 5.25 0 0 1 0 7.424C17.885 17.25 15.368 19.51 13.955 20.91Z" />
    </Svg>
);

export const AdjustmentsHorizontalIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </Svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
);
export const BookmarkIcon: React.FC<IconProps> = ({ style }) => (
    <Svg
        width={style?.width || 24}
        height={style?.height || 24}
        viewBox="0 0 24 24"
        fill="none"
    >
        <Path
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            stroke={style?.color || '#6B7280'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={style?.color === '#2563EB' ? style.color : 'none'} // Fill when saved
        />
    </Svg>
);


export const BuildingOfficeIcon: React.FC<IconProps> = ({ style, width = 24, height = 24, color = "currentColor" }) => (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} style={style}>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6Zm.75 5.25h.008v.008H6v-.008Zm-.75 5.25h.008v.008H5.25v-.008Zm0-10.5h.008v.008H5.25V6Zm-.75 5.25h.008v.008H4.5v-.008Zm.75 5.25h.008v.008H6v-.008Zm.75-10.5h.008v.008H6.75V6Zm-.75 5.25h.008v.008H6.75v-.008Zm.75 5.25h.008v.008H6.75v-.008Zm.75-10.5h.008v.008H7.5V6Zm-.75 5.25h.008v.008H6.75v-.008Zm.75 5.25h.008v.008H7.5v-.008Zm6-10.5h.008v.008h-.008V6Zm.75 5.25h.008v.008h-.008v-.008Zm-.75 5.25h.008v.008h-.008v-.008Zm0-10.5h.008v.008h-.008V6Zm-.75 5.25h.008v.008h-.008v-.008Zm.75 5.25h.008v.008h-.008v-.008Zm.75-10.5h.008v.008h-.008V6Zm-.75 5.25h.008v.008h-.008v-.008Zm.75 5.25h.008v.008h-.008v-.008Z" />
    </Svg>
)