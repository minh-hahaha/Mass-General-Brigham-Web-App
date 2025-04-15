import DrawNodes from "@/components/DrawNodes.tsx";


const MapEditorPage = () => {
    return (
        <>
            <div>
                <DrawNodes svgMapUrl={"/20PPFloor1.svg"} buildingId={"2"} currentFloor={"1"}/>
            </div>
        </>
    )
}

export default MapEditorPage;