import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ChevronLeftIcon, PaperAirplaneIcon } from '../components/icons';
import { Conversation, Message, UserRole } from '../types';

interface ChatScreenProps {
    conversation: Conversation;
    onSendMessage: (text: string) => void;
    onNavigateBack: () => void;
    currentUserRole: UserRole;
}

const MessageBubble: React.FC<{ message: Message; currentUserRole: UserRole }> = ({ message, currentUserRole }) => {
    const isMe = message.sender === currentUserRole;
    return (
        <View style={[styles.messageContainer, isMe ? styles.messageContainerMe : styles.messageContainerOther]}>
            <View style={[
                styles.messageBubble,
                isMe ? styles.messageBubbleMe : styles.messageBubbleOther
            ]}>
                <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
                    {message.text}
                </Text>
                <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampOther]}>
                    {message.timestamp}
                </Text>
            </View>
        </View>
    );
};

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, onSendMessage, onNavigateBack, currentUserRole }) => {
    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const chatPartnerName = currentUserRole === UserRole.Pharmacist
        ? conversation.pharmacyName
        : conversation.pharmacistName;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.chatPartnerName} numberOfLines={1}>{chatPartnerName}</Text>
                    <Text style={styles.jobRole} numberOfLines={1}>{conversation.jobRole}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
                keyboardVerticalOffset={80}
            >
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                >
                    {conversation.messages.map(message => (
                        <MessageBubble key={message.id} message={message} currentUserRole={currentUserRole} />
                    ))}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <View style={styles.inputRow}>
                        <TextInput
                            placeholder="Type a message..."
                            value={newMessage}
                            onChangeText={setNewMessage}
                            onSubmitEditing={handleSend}
                            style={styles.textInput}
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            style={[
                                styles.sendButton,
                                !newMessage.trim() ? styles.sendButtonDisabled : styles.sendButtonEnabled
                            ]}
                            disabled={!newMessage.trim()}
                            activeOpacity={0.8}
                        >
                            <PaperAirplaneIcon style={styles.sendIcon} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backIcon: {
        width: 24,
        height: 24,
        color: '#4B5563',
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    chatPartnerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    jobRole: {
        fontSize: 14,
        color: '#6B7280',
    },
    headerSpacer: {
        width: 24,
    },
    keyboardView: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    messageContainerMe: {
        justifyContent: 'flex-end',
    },
    messageContainerOther: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    messageBubbleMe: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 8,
    },
    messageBubbleOther: {
        backgroundColor: '#E5E7EB',
        borderBottomLeftRadius: 8,
    },
    messageText: {
        fontSize: 14,
    },
    messageTextMe: {
        color: '#FFFFFF',
    },
    messageTextOther: {
        color: '#1F2937',
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right',
    },
    timestampMe: {
        color: '#BFDBFE',
    },
    timestampOther: {
        color: '#6B7280',
    },
    inputContainer: {
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        padding: 12,
        borderRadius: 20,
    },
    sendButtonEnabled: {
        backgroundColor: '#2563EB',
    },
    sendButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    sendIcon: {
        width: 20,
        height: 20,
    },
});

export default ChatScreen;