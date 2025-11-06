package com.school.kps.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    @Column(name = "user_id")
    private int id;

    @Column(length = 100, nullable = false, name = "email")
    private String email;

    @Column(length = 100, nullable = false, name = "password")
    private String password;
}
