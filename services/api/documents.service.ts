import { apiClient } from './client';
import { DocumentKey, UploadedFile } from '../../types';

export const documentsService = {
    async uploadDocument(
        documentType: DocumentKey,
        file: any // This would be the file from react-native-document-picker
    ): Promise<UploadedFile> {
        const formData = new FormData();
        formData.append('document', {
            uri: file.uri,
            type: file.type,
            name: file.name,
        } as any);
        formData.append('documentType', documentType);

        return apiClient.upload(`/documents/upload`, formData);
    },

    async getDocuments(): Promise<any[]> {
        return apiClient.get('/documents');
    },

    async deleteDocument(documentId: string): Promise<void> {
        await apiClient.delete(`/documents/${documentId}`);
    },
};
