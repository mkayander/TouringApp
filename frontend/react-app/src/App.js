import './App.css';
import {Map, Marker, Overlay} from 'pigeon-maps';

const provider = (x, y, z) => {
    const s = String.fromCharCode(97 + ((x + y + z) % 3));
    return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <Map provider={provider} defaultCenter={[55.4331145, 37.5562910]} defaultZoom={12} width={1024}
                     height={720}>
                    <Marker anchor={[55.4331145, 37.5562910]} payload={1} onClick={({event, anchor, payload}) => {
                    }}/>

                    {/*<Overlay anchor={[50.879, 4.6997]} offset={[120, 79]}>*/}
                    {/*    <img src='pigeon.jpg' width={240} height={158} alt=''/>*/}
                    {/*</Overlay>*/}
                </Map>
            </div>
        </div>
    );
}

export default App;
