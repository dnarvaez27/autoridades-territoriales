import xml.etree.ElementTree as ET
import json

tree = ET.parse('reg.html')
root = tree.getroot()

data = []

for r in root:
    if r.tag == 'tr':
        name = r[1]
        addr = r[2]
        lat = r[3][0].get('data-puesto-latitud')
        lon = r[3][0].get('data-puesto-longitud')
        disp = r[3][0].get('data-puesto-noveda')

        data.append( {
            'name': name.text, 
            'address': addr.text, 
            'location': {
                'latitude': float(lat),
                'longitude': float(lon)
            },
            'open': (disp == '0')
        } )

with open('data.json', 'w', encoding='utf8') as f:
    json.dump(data, f, ensure_ascii=False)


# print(root[1][0].tag)
