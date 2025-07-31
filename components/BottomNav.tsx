import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tab, UserRole } from '../types';
import { HomeIcon, SearchIcon, BriefcaseIcon, ChatBubbleLeftRightIcon } from './icons';

interface CustomBottomNavProps extends BottomTabBarProps {
    hasConversations: boolean;
    userRole: UserRole;
}

interface TabConfig {
    routeName: string;
    icon: React.ReactElement;
    label: string;
    isVisible: boolean;
    isDisabled?: boolean;
}

const BottomNav: React.FC<CustomBottomNavProps> = ({
                                                       state,
                                                       descriptors,
                                                       navigation,
                                                       hasConversations,
                                                       userRole
                                                   }) => {
    // Define all possible tabs with their configurations
    const allTabs: TabConfig[] = [
        {
            routeName: 'Home',
            icon: <HomeIcon />,
            label: 'Home',
            isVisible: true, // Always visible for both roles
        },
        {
            routeName: 'Explore',
            icon: <SearchIcon />,
            label: 'Explore',
            isVisible: userRole === UserRole.Pharmacist, // Only visible for pharmacists
        },
        {
            routeName: 'Messages',
            icon: <ChatBubbleLeftRightIcon />,
            label: 'Messages',
            isVisible: true, // Always visible for both roles
            isDisabled: !hasConversations, // Disabled when no conversations
        },
        {
            routeName: 'MyJobs',
            icon: <BriefcaseIcon />,
            label: 'MyJobs',
            isVisible: userRole === UserRole.Pharmacist, // Only visible for pharmacists
        },
    ];

    // Filter tabs based on visibility for current user role
    const visibleTabs = allTabs.filter(tab => tab.isVisible);

    // Get the index of the currently focused tab within visible tabs
    const getCurrentTabIndex = (): number => {
        const currentRouteName = state.routes[state.index]?.name;
        return visibleTabs.findIndex(tab => tab.routeName === currentRouteName);
    };

    const currentTabIndex = getCurrentTabIndex();

    const handleTabPress = (tab: TabConfig, tabIndex: number) => {
        // Don't proceed if tab is disabled
        if (tab.isDisabled) return;

        const isFocused = currentTabIndex === tabIndex;

        const event = navigation.emit({
            type: 'tabPress',
            target: state.routes.find(route => route.name === tab.routeName)?.key || '',
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.routeName);
        }
    };

    const getTabStyles = (tab: TabConfig, tabIndex: number, isFocused: boolean) => {
        const activeColor = '#2563EB';
        const inactiveColor = '#6B7280';
        const disabledColor = '#9CA3AF';

        let color = isFocused ? activeColor : inactiveColor;

        if (tab.isDisabled) {
            color = disabledColor;
        }

        return {
            color,
            opacity: tab.isDisabled ? 0.5 : 1,
        };
    };

    const renderTabItem = (tab: TabConfig, index: number) => {
        const isFocused = currentTabIndex === index;
        const styles = getTabStyles(tab, index, isFocused);

        return (
            <TouchableOpacity
                key={tab.routeName}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={`${tab.label} tab`}
                onPress={() => handleTabPress(tab, index)}
                disabled={tab.isDisabled}
                style={[
                    tabStyles.tab,
                    tab.isDisabled && tabStyles.disabledTab
                ]}
                activeOpacity={tab.isDisabled ? 1 : 0.7}
            >
                {React.cloneElement(tab.icon, {
                    color: styles.color,
                    style: [tab.icon.props.style, { color: styles.color }]
                })}
                <Text style={[
                    tabStyles.tabText,
                    {
                        color: styles.color,
                        opacity: styles.opacity,
                        fontWeight: isFocused ? '600' : '400'
                    }
                ]}>
                    {tab.label}
                </Text>

                {/* Add notification indicator for Messages tab when disabled but has conversations */}
                {tab.routeName === 'Messages' && tab.isDisabled && hasConversations && (
                    <View style={tabStyles.notificationBadge}>
                        <View style={tabStyles.notificationDot} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView edges={['bottom']} style={containerStyles.container}>
            <View style={containerStyles.tabRow}>
                {visibleTabs.map(renderTabItem)}
            </View>

            {/* Role indicator (optional - can be removed if not needed) */}
            {__DEV__ && (
                <View style={containerStyles.roleIndicator}>
                    <Text style={containerStyles.roleText}>
                        {userRole === UserRole.Pharmacy ? 'Pharmacy' : 'Pharmacist'}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

// Styles organized by component sections
const containerStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    roleIndicator: {
        position: 'absolute',
        top: -20,
        right: 8,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roleText: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
    },
});

const tabStyles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 6,
        paddingHorizontal: 4,
        minHeight: 60,
        position: 'relative',
    },
    disabledTab: {
        opacity: 0.6,
    },
    tabText: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: '30%',
        backgroundColor: 'transparent',
    },
    notificationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
});

export default BottomNav;