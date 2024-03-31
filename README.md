# Test Abrico - Web development -- Order dashboard

**Front**

- **permet à l’utilisateur de filtrer par numéro d’invoice, statut et client**
    - Modification dans Ordertable : La fonction *descendingComparator* doit maintenant prendre en compte le client en prenant ses initiales. Ajout de *handleRequestSort* pour identifier quelle colonne doit changer lorsque l'utilisateur appuie.

**Back**  

- **Utilise firestore comme DB**
    - Téléchargement des fichiers via Python.
    - Connexion de Firestore avec le fichier de configuration Firestore.
    - Transformation des données en un tableau d'objets avec une interface **`FireOrder`** et la fonction **`fetchOrders`** pour récupérer les objets depuis Firebase et les parser.
- **Migre les données de la table d’orders sur Firestore**
    - *updateOrderStatus + handleDateChange*

**Front & Back**

- **Permet à l’utilisation de modifier**
    - de la date : *handleStatusChange + StatusDropdown function*
    - du status : *handleDateChange + contentEditable*
- **Que proposes-tu pour tester ton code ?**
    - unit tests : simuler l’interaction avec l’utilisateur, vérifier que les différents composants React générent le bon output, vérifier que les fonctions produisent le bon output, tester que la connection à Firebase est bien effectuée, et que les documents sont au bon format, tester que le visuel est pareil sur les différents navigateurs.
- **Quelles améliorations de ton code proposes tu ?**
    - error handling
    - annoter correctement tous les types, éviter d’utiliser Any
    - modulariser le code : par exemple, sortir les différentes fonctions
