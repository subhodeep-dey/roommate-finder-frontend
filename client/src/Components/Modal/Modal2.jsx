import { useContext } from "react";
import { ListingContext } from "../../Context/listing-context";
import "./Modal.css";

function Modal2() {
  const { seletedroomdetail, seletedroomname, seletedroomphone, closeModal2 } =
    useContext(ListingContext);
  console.log(seletedroomdetail);
  return (
    <aside className="modal-overlay">
      <div className="modal-container">
        <div className="habits">
          <div className="habitstab-main">
            <div className="habits-buttons">
              <div className="activehabits">
                <p className="habits-text">Leader</p>
              </div>
            </div>
            <div className="habitstab-hr">
              <hr />
            </div>
          </div>
          <div className="habitssection">
            <p>{seletedroomdetail}</p>
          </div>
          <button
            onClick={closeModal2}
            className="mx-auto bg-[#06105A] px-[0.75rem] py-[0.1rem] text-white rounded-[4px] self-start disabled:hover:cursor-not-allowed"
          >
            close
          </button>
        </div>
      </div>
    </aside>
  );
}
export default Modal2;
