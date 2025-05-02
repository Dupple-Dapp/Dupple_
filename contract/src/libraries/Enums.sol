// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library Enums {
    enum RelationshipStatus {
        Single,
        Taken,
        Complicated,
        Open
    }
    enum ReasonForJoining {
        HereToDate,
        OpenToChat,
        ReadyForRelationship
    }
    enum Drinking {
        Never,
        Socially,
        Often,
        Sober
    }
    enum Smoking {
        Yes,
        No,
        Sometimes
    }
    enum Gender {
        Male,
        Female,
        Bi,
        Lesbian,
        Gay
    }

    
}
