import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { changeImage } from '../services/helpers';

const CreateImage = ({ defaultValues }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState([]);

    function onImageChange(e) {
        let images = e.target.value.split(",").map(img => img.trim());
        console.log("changed");
        setImages(images);
    }

    function removeImage(imageUrl) {
        const index = images.indexOf(imageUrl);

        setImages(prev => {
            if (index !== -1) {
                prev.splice(index, 1);
            }

            return [...prev];
        });
    }

    useEffect(() => {
        setImages(defaultValues);
    }, [defaultValues]);

    return (
        <section>
            <div className='form-item'>
                <label htmlFor="images">{`${t("admin.create.image")}*`}</label>
                <input className='item' type="text" required name="images" value={images?.join(", ")} onChange={onImageChange} id='images' />
            </div>

            {images.length > 0 &&
                <article className="images">
                    {
                        images.map(imageUrl => (
                            imageUrl !== "" &&
                            <span key={imageUrl} >
                                <img onError={changeImage} src={imageUrl} alt='Product image' />

                                <span className='overlay'>
                                    <i onClick={() => removeImage(imageUrl)} className="fa-solid fa-xmark"></i>
                                </span>
                            </span>
                        ))
                    }
                </article>
            }
        </section>
    );
}

export default CreateImage;