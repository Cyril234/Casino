package ch.axa.Aufgabe1;

public class KlassBook {
    private String author;
    private String title;
    private String nrPage;
    public String refNumber;
    private int borrowed;

    public KlassBook(String author, String title, String nrPage, String refNumber) {
        this.author = author;
        this.title = title;
        this.nrPage = nrPage;
        this.refNumber = refNumber;
    }


    public String getAuthor() {
        return author;
    }
    public String getTitle() {
        return title;
    }
    public String getNrPage() {
        return nrPage;
    }
    public String getRefNumber() {
        return refNumber;
    }


    @Override
    public String toString() {
        return "KlassBook{" +
                "author='" + author + '\'' +
                ", title='" + title + '\'' +
                ", nrPage='" + nrPage + '\'' +
                ", refNumber='" + refNumber + '\'' +
                '}';
    }

    public void setRufNumber(String ref){
        this.nrPage = ref;
    }
}
