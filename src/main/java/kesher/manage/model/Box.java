package kesher.manage.model;



import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name="box")
public class Box implements Serializable {

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @NotNull
    @Column(nullable = false,updatable = true)
    private Date updatedAt;

   private String BoxManager;

   @OneToOne
   private Address address;

   @Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
   @Pattern(regexp = "\\d{10}", message = "Phone number must contain only digits")
   private String phone;

    public static final class BoxBuilder {
        private int id;
        private @NotNull Date updatedAt;
        private String BoxManager;
        private Address address;
        private @Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits") @Pattern(regexp = "\\d{10}", message = "Phone number must contain only digits") String phone;

        private BoxBuilder() {
        }

        public static BoxBuilder aBox() {
            return new BoxBuilder();
        }

        public BoxBuilder id(int id) {
            this.id = id;
            return this;
        }

        public BoxBuilder updatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public BoxBuilder BoxManager(String BoxManager) {
            this.BoxManager = BoxManager;
            return this;
        }

        public BoxBuilder address(Address address) {
            this.address = address;
            return this;
        }

        public BoxBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Box build() {
            Box box = new Box();
            box.id = this.id;
            box.BoxManager = this.BoxManager;
            box.phone = this.phone;
            box.updatedAt = this.updatedAt;
            box.address = this.address;
            return box;
        }
    }
}
