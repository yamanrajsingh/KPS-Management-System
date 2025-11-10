package com.school.kps.entity;


import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "admin")
@Getter
@Setter
@AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    @Column(name = "user_id")
    private int id;

    @Column(length = 100, nullable = false, name = "email",unique = true)
    private String email;

    @Column(length = 100, nullable = false, name = "password")
    private String password;

    private String role = "ROLE_ADMIN";
}
