package com.example.LearningPlan.modules.user_management.dtos;

import java.util.Date;

public class AccountDeactivationDTO {
    private Date deactivateStartDate;
    private Date deactivateEndDate;

    // Getters and Setters
    public Date getDeactivateStartDate() {
        return deactivateStartDate;
    }

    public void setDeactivateStartDate(Date deactivateStartDate) {
        this.deactivateStartDate = deactivateStartDate;
    }

    public Date getDeactivateEndDate() {
        return deactivateEndDate;
    }

    public void setDeactivateEndDate(Date deactivateEndDate) {
        this.deactivateEndDate = deactivateEndDate;
    }
}