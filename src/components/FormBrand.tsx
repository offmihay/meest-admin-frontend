const FormBrand = () => {
    return (
        <div className="w-[400px] h-[350px] bg-white flex flex-col justify-center items-center rounded-3xl my-8 mx-8">
            <img className="w-[340px] h-[250px] mt-[5px]" src="/assets/images/GAP_Logo.png"></img>
            <div className="w-full h-[85px] flex justify-between items-center mx-4 rounded-b-3xl px-8 mt-3">
                <div className="w-[150px] h-16 flex items-center justify-between px-2">
                    <img className="w-10 h-10" src="/assets/images/edit.svg"></img><p>Редагувати</p>
                </div>

                <div className="w-[135px] h-16 flex items-center justify-between px-2">
                    <img className="w-10 h-10" src="/assets/images/delete.svg"></img><p>Видалити</p>
                </div>
            </div>
        </div>
    );
}

export default FormBrand;