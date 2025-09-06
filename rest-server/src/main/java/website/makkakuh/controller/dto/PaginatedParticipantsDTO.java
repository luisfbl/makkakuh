package website.makkakuh.controller.dto;

import java.util.List;

public class PaginatedParticipantsDTO {
    public List<ParticipantDTO> subscriptions;
    public long totalElements;
    public long totalPages;
    public int currentPage;
    public int pageSize;
    public boolean hasNext;
    public boolean hasPrevious;

    public PaginatedParticipantsDTO() {}

    public PaginatedParticipantsDTO(List<ParticipantDTO> subscriptions, long totalElements, int currentPage, int pageSize) {
        this.subscriptions = subscriptions;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = (totalElements + pageSize - 1) / pageSize;
        this.hasNext = currentPage < this.totalPages - 1;
        this.hasPrevious = currentPage > 0;
    }
}