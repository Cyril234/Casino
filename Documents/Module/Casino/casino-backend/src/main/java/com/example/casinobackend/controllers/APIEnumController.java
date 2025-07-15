package com.example.casinobackend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.enums.Eyecolor;
import com.example.casinobackend.enums.Haircolor;
import com.example.casinobackend.enums.Headgear;
import com.example.casinobackend.enums.Shirt;
import com.example.casinobackend.enums.Shoes;
import com.example.casinobackend.enums.Skincolor;
import com.example.casinobackend.enums.Trouserscolor;
import com.example.casinobackend.enums.Trouserstype;

@RestController
@RequestMapping("/api/enums")
@CrossOrigin(origins = "http://localhost:5173")
public class APIEnumController {

    @GetMapping(value = "/haircolor")
    public Haircolor[] getHaircolors() {
        return Haircolor.values();
    }

    @GetMapping("/skincolor")
    public Skincolor[] getSkincolors() {
        return Skincolor.values();
    }

    @GetMapping("/eyecolor")
    public Eyecolor[] getEyecolors() {
        return Eyecolor.values();
    }

    @GetMapping("/headgear")
    public Headgear[] getHeadgear() {
        return Headgear.values();
    }

    @GetMapping("/shirt")
    public Shirt[] getShirts() {
        return Shirt.values();
    }

    @GetMapping("/shoes")
    public Shoes[] getShoes() {
        return Shoes.values();
    }

    @GetMapping("/trouserscolor")
    public Trouserscolor[] getTrouserscolors() {
        return Trouserscolor.values();
    }

    @GetMapping("/trouserstype")
    public Trouserstype[] getTrouserstypes() {
        return Trouserstype.values();
    }
}
