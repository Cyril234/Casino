package com.example.casinobackend.entities;

import com.example.casinobackend.enums.Eyecolor;
import com.example.casinobackend.enums.Haircolor;
import com.example.casinobackend.enums.Headgear;
import com.example.casinobackend.enums.Shirt;
import com.example.casinobackend.enums.Shoes;
import com.example.casinobackend.enums.Skincolor;
import com.example.casinobackend.enums.Trouserscolor;
import com.example.casinobackend.enums.Trouserstype;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "avatar")
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "avatar_id")
    private Long avatarId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "haircolor", nullable = false)
    private Haircolor haircolor;

    @Column(name = "skincolor", nullable = false)
    private Skincolor skincolor;

    @Column(name = "beard", nullable = false)
    private Boolean beard;

    @Column(name = "eyecolor", nullable = false)
    private Eyecolor eyecolor;

    @Column(name = "headgear", nullable = false)
    private Headgear headgear;

    @Column(name = "shirt", nullable = false)
    private Shirt shirt;

    @Column(name = "trouserstype", nullable = false)
    private Trouserstype trouserstype;

    @Column(name = "trouserscolor", nullable = false)
    private Trouserscolor trouserscolor;

    @Column(name = "shoes", nullable = false)
    private Shoes shoes;

    @OneToOne
    @JoinColumn(name = "player_id")
    private Player player;

    public Long getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(Long avatarId) {
        this.avatarId = avatarId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Haircolor getHaircolor() {
        return haircolor;
    }

    public void setHaircolor(Haircolor haircolor) {
        this.haircolor = haircolor;
    }

    public Skincolor getSkincolor() {
        return skincolor;
    }

    public void setSkincolor(Skincolor skincolor) {
        this.skincolor = skincolor;
    }

    public Boolean getBeard() {
        return beard;
    }

    public void setBeard(Boolean beard) {
        this.beard = beard;
    }

    public Eyecolor getEyecolor() {
        return eyecolor;
    }

    public void setEyecolor(Eyecolor eyecolor) {
        this.eyecolor = eyecolor;
    }

    public Headgear getHeadgear() {
        return headgear;
    }

    public void setHeadgear(Headgear headgear) {
        this.headgear = headgear;
    }

    public Shirt getShirt() {
        return shirt;
    }

    public void setShirt(Shirt shirt) {
        this.shirt = shirt;
    }

    public Trouserstype getTrouserstype() {
        return trouserstype;
    }

    public void setTrouserstype(Trouserstype trouserstype) {
        this.trouserstype = trouserstype;
    }

    public Trouserscolor getTrouserscolor() {
        return trouserscolor;
    }

    public void setTrouserscolor(Trouserscolor trouserscolor) {
        this.trouserscolor = trouserscolor;
    }

    public Shoes getShoes() {
        return shoes;
    }

    public void setShoes(Shoes shoes) {
        this.shoes = shoes;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

}
