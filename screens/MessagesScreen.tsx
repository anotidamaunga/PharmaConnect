import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet } from 'react-native';
import { ChatBubbleLeftRightIcon, ChevronRightIcon } from '../components/icons';
import { Conversation, UserRole } from '../types';

interface MessagesScreenProps {
    conversations: Conversation[];
    onOpenChat: (conversationId: string) => void;
    currentUserRole: UserRole;
}

const ConversationItem: React.FC<{ conversation: Conversation, onClick: () => void, currentUserRole: UserRole }> = ({ conversation, onClick, currentUserRole }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    return (
        <TouchableOpacity onPress={onClick} style={styles.conversationItem} activeOpacity={0.9}>
            <View style={styles.conversationIcon}>
                <ChatBubbleLeftRightIcon style={styles.chatIcon} />
            </View>
            <View style={styles.conversationContent}>
                <Text style={styles.pharmacyName} numberOfLines={1}>{conversation.pharmacyName}</Text>
                <Text style={styles.jobRole} numberOfLines={1}>{conversation.jobRole}</Text>
                {lastMessage && (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {lastMessage.sender === currentUserRole && <Text style={styles.youLabel}>You: </Text>}{lastMessage.text}
                    </Text>
                )}
            </View>
            <ChevronRightIcon style={styles.chevronIcon} />
        </TouchableOpacity>
    );
};

const MessagesScreen: React.FC<MessagesScreenProps> = ({ conversations, onOpenChat, currentUserRole }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            {conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ConversationItem
                            conversation={item}
                            onClick={() => onOpenChat(item.id)}
                            currentUserRole={currentUserRole}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyState}>
                    <ChatBubbleLeftRightIcon style={styles.emptyIcon}/>
                    <Text style={styles.emptyTitle}>No Messages Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Your conversations with pharmacies will appear here once you are confirmed for a job.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    listContent: {
        padding: 16,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    conversationIcon: {
        padding: 12,
        backgroundColor: '#DBEAFE',
        borderRadius: 20,
    },
    chatIcon: {
        width: 24,
        height: 24,
        color: '#2563EB',
    },
    conversationContent: {
        flex: 1,
        overflow: 'hidden',
    },
    pharmacyName: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 16,
    },
    jobRole: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6B7280',
    },
    youLabel: {
        fontWeight: '600',
    },
    chevronIcon: {
        width: 20,
        height: 20,
        color: '#9CA3AF',
        flexShrink: 0,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyIcon: {
        width: 64,
        height: 64,
        color: '#D1D5DB',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    emptySubtitle: {
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default MessagesScreen;