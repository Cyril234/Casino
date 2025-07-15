package com.example.casinobackend.services;

import javax.smartcardio.*;

import com.example.casinobackend.controllers.APILoginController;

public class NFCReader {

    public void scanUID() {
        try {
            TerminalFactory factory = TerminalFactory.getDefault();
            CardTerminals terminals = factory.terminals();
            APILoginController loginController = new APILoginController();

            while (true) {
                for (CardTerminal terminal : terminals.list()) {
                    boolean cardPresent = terminal.isCardPresent();
                    if (cardPresent) {
                        Card card = terminal.connect("*");
                        CardChannel channel = card.getBasicChannel();
                        byte[] getUid = new byte[] { (byte)0xFF, (byte)0xCA, 0x00, 0x00, 0x00 };
                        ResponseAPDU response = channel.transmit(new CommandAPDU(getUid));
                        String uidHex = bytesToHex(response.getData()).trim();
                        loginController.setUID(uidHex);
                        System.out.println(uidHex);
                        card.disconnect(false);
                        break;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02X ", b));
        return sb.toString();
    }
}