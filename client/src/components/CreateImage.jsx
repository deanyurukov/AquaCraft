import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { changeImage } from '../services/helpers';

const CreateImage = ({ defaultValues = [] }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState(defaultValues);
    
    function onImageChange(e) {
        let images = e.target.value.split(",").map(img => img.trim());

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

    return (
        <section>
            <div>
                <label>{`${t("admin.create.image")}*`}</label>
                <input type="text" required name="images" value={images?.join(", ")} onChange={onImageChange} />
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