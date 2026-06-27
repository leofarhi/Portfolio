window.PROJECTS_DATA = {
  "projects": [
    {
      "id": "moderaworld",
      "title": "Moderaworld",
      "date": "2023 – aujourd’hui",
      "duration": "3 ans",
      "category": [
        "Narration",
        "AI"
      ],
      "icon": "",
      "media": "",
      "description": "[b]Moderaworld[/b] est un projet d’anime sur lequel je travaille depuis 2023.\nJe me suis fixé un objectif assez ambitieux : réussir à produire un anime proche du style japonais, seul, sans budget, en utilisant la 3D et en créant moi-même les outils qui me manquent.\n\nJe ne voulais pas simplement mettre un [i]filtre cartoon[/i] sur un modèle 3D. Mon objectif est que le résultat puisse réellement être [u]confondu avec de la 2D[/u] : des couleurs propres, des formes contrôlées, des contours qui restent cohérents et surtout un rendu capable de changer selon l’angle de la caméra, comme dans un dessin fait à la main.",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Les personnages — Partir de VRoid, puis dépasser ses limites",
              "description": "Pour créer les personnages, j’ai commencé avec VRoid Studio.\nL’outil permet de fabriquer rapidement des modèles dans un style proche de l’animation japonaise, ce qui était parfait pour poser les premières bases sans passer des mois sur chaque personnage.\n\nMais VRoid n’était pas conçu pour ma façon de travailler. J’avais besoin de comparer précisément les silhouettes, de garder les mêmes angles de caméra entre plusieurs versions et de superposer des références pendant la création.\n\nComme VRoid est développé avec Unity, j’ai utilisé MelonLoader pour lui ajouter mes propres outils, comme un système d’overlay pour afficher une image de référence au-dessus du modèle, \nun verrouillage de la caméra sur des angles précis, etc...",
              "medias": []
            },
            {
              "title": "Premiers essais — Projeter une image 2D dans Blender",
              "description": "Mon premier vrai problème a été le rendu des personnages.\nUn modèle VRoid reste immédiatement reconnaissable comme un modèle 3D, même avec des textures propres et un shader toon. J’ai donc créé un addon Blender capable de placer plusieurs projecteurs autour du personnage.\n\nChaque projecteur photographiait le modèle depuis un angle différent. Mon addon pilotait ensuite ComfyUI par son API. ComfyUI est un outil de génération d’images basé sur des workflows de nodes, qui permet notamment d’utiliser Stable Diffusion et ControlNet. Je n’avais donc pas besoin de quitter Blender : un bouton lançait le workflow, envoyait les captures et récupérait automatiquement l’image générée.\n\nL’IA produisait une version plus proche d’une illustration 2D, puis mon addon la reprojetait sur le modèle pour peindre sa texture. Je pouvais ainsi générer une vue du visage, des vêtements ou d’une partie du corps, puis transférer le résultat dans les textures du modèle.\n\nMais l’addon devenait de plus en plus difficile à utiliser. Les projecteurs dépendaient trop de Blender, leur configuration manquait de précision et le passage entre la génération, la projection et la retouche demandait trop de manipulations.",
              "medias": []
            },
            {
              "title": "EbSynth — Une bonne idée, mais pas assez stable",
              "description": "J’ai aussi testé EbSynth.\nLe principe est très intéressant : on redessine une image clé d’une vidéo, puis le logiciel propage ce style sur les images suivantes. Sur le papier, c’était une solution idéale pour transformer une animation 3D en animation 2D sans avoir à redessiner chaque frame.\n\nDans mes essais, le résultat manquait malheureusement de stabilité.\nDès que le personnage tournait, qu’une partie du visage disparaissait ou qu’un élément passait devant un autre, le style se déformait ou glissait. Il fallait multiplier les images clés et corriger beaucoup de frames à la main.\n\nJe n’ai pas complètement abandonné cette piste, mais elle ne pouvait pas devenir la base du pipeline. Pour un anime complet, les petites erreurs s’accumulent beaucoup trop vite.",
              "medias": []
            },
            {
              "title": "Pourquoi Unity plutôt que Blender ?",
              "description": "Pour le rendu final de Moderaworld, j’ai choisi Unity plutôt que Blender.\nBlender est très puissant, mais je me sens plus libre dans un moteur temps réel. Je peux programmer exactement le comportement de la caméra, modifier les shaders, construire mes propres interfaces, tester une scène immédiatement et automatiser les parties répétitives du pipeline.\n\nUnity me permet aussi de traiter l’anime comme un vrai environnement interactif avant de lancer le rendu : déplacer les personnages, changer une pose, ajuster la lumière ou tester un cadrage sans relancer une longue phase de calcul.\n\nCe choix ne simplifie pas tout. Il m’oblige parfois à recréer des outils déjà présents dans les logiciels d’animation classiques. Mais c’est justement ce contrôle qui m’intéresse : je préfère perdre du temps une fois à construire le bon outil plutôt que répéter la même manipulation sur chaque plan.",
              "medias": []
            },
            {
              "title": "MyMocap — Capturer mes propres animations",
              "description": "Pour animer les personnages, j’avais aussi besoin d’un système de motion capture.\nLes solutions existantes étaient souvent payantes, mal adaptées à mon matériel ou trop limitées sur un point important pour moi : le suivi des mains et des doigts.\n\nComme je possède plusieurs Kinect V1 et V2, j’ai commencé [projet=mymocap]MyMocap[/projet]. L’idée est de placer plusieurs caméras autour de l’acteur et de combiner la profondeur des Kinect avec les détections de bibliothèques Python comme MediaPipe.\n\nChaque caméra observe le corps, le visage et les 21 points de chaque main depuis un angle différent. Lorsqu’une main est cachée pour une caméra, une autre peut donc continuer à la voir.\n\nLe prototype actuel aligne déjà une Kinect V2 et une caméra secondaire dans le même espace 3D. La prochaine étape est de fusionner leurs mesures articulation par articulation, puis d’envoyer le mouvement final vers les personnages de Moderaworld.",
              "medias": []
            },
            {
              "title": "ProjectorAI — Construire l’outil que Blender ne me donnait pas",
              "description": "À force de pousser mon addon Blender, j’ai fini par comprendre que le problème venait surtout de l’outil lui-même.\nJ’avais besoin d’un logiciel consacré uniquement au modèle, aux projecteurs, aux passes de rendu, à ComfyUI et à la peinture de texture. J’ai donc commencé [projet=projectorai]ProjectorAI[/projet].\n\nDans ce logiciel, chaque projecteur est indépendant. Je peux choisir sa position, son angle, son champ de vision, sa résolution, les images envoyées à l’IA et son propre workflow ComfyUI.\nCela permet par exemple de traiter le visage avec des réglages très précis, les vêtements avec un autre workflow, puis les cheveux depuis plusieurs directions.\n\nLe résultat généré est ensuite reprojeté dans les textures du modèle. Le système fonctionne déjà bien pour créer une base 2D cohérente et corriger localement certaines parties sans repeindre tout le personnage.",
              "medias": []
            },
            {
              "title": "Neural Rendering — Faire varier le rendu selon la caméra",
              "description": "Même avec une très bonne texture, quelque chose continue de trahir la 3D.\nDans un dessin animé, un visage n’a pas forcément la même forme ni les mêmes couleurs selon l’angle. Un œil peut être agrandi de profil, une mèche peut changer de silhouette, une ombre peut disparaître et une ligne de contour peut être déplacée volontairement.\n\nUn modèle 3D classique ne fonctionne pas comme ça. Un point de sa surface possède une texture fixe. On peut ajouter un outline ou mieux contrôler les ombres, mais la couleur reste la même quelle que soit la caméra.\n\nJ’ai d’abord étudié le Gaussian Splatting, qui remplace les triangles par un grand nombre de points orientés dans l’espace. Cette technique permet de faire apparaître certains détails uniquement depuis certains angles. Le problème, c’est que les fichiers deviennent vite lourds et que ces points ne sont pas naturellement attachés au squelette du personnage, ce qui complique énormément l’animation.\n\nJ’ai donc créé [projet=neural-rendering]Neural Rendering[/projet].\nLa première version générait une UV map et une normal map du modèle, puis un réseau de neurones colorisait toute l’image en post-processing. Le principe fonctionnait, mais il fallait exécuter le même gros réseau pour chaque pixel affiché. Le rendu était donc beaucoup trop lent.\n\nDans la seconde version, chaque texel de la texture contient son propre mini-modèle neuronal. Le shader exécute seulement le mini-modèle correspondant au pixel affiché, qui choisit sa couleur selon l’angle de la caméra. Le rendu devient fluide et chaque texel peut apprendre indépendamment des autres.\n\nLe principal inconvénient est que les textures neuronales sont environ douze fois plus lourdes qu’une texture classique. Mais pour Moderaworld, c’est beaucoup plus intéressant qu’un gros réseau lent à exécuter sur chaque image.",
              "medias": []
            },
            {
              "title": "État actuel — L’histoire et la technique avancent ensemble",
              "description": "Moderaworld est encore en développement.\nJe travaille actuellement sur l’histoire, les personnages et plusieurs versions de la trame, mais je préfère ne rien détailler ici pour éviter de dévoiler le contenu de l’anime. En parallèle, je continue d’améliorer le pipeline visuel pour qu’il puisse servir à une production complète, et pas seulement à quelques images de démonstration.\n\nLe plus difficile, c’est que chaque avancée apporte son nouveau problème : créer les personnages demande de meilleurs outils, les texturer demande ProjectorAI, les afficher correctement demande Neural Rendering, et tout cela doit ensuite fonctionner dans une vraie scène animée.\n\nC’est probablement le projet le plus ambitieux que j’ai commencé. Il rassemble presque tout ce que j’aime faire : écrire une histoire, créer un univers, travailler sur la 3D et développer mes propres moteurs, shaders et outils d’intelligence artificielle.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "mymocap",
      "title": "MyMocap",
      "date": "6 – 17 mars 2026",
      "duration": "11 jours",
      "category": [
        "AI",
        "Tools"
      ],
      "icon": "",
      "media": "",
      "description": "[b]MyMocap[/b] est un système de motion capture que j’ai commencé pour animer les personnages de [projet=moderaworld]Moderaworld[/projet].\nJe voulais pouvoir enregistrer le corps, le visage, le regard et surtout les mains sans dépendre d’un abonnement ou d’un logiciel fermé.\n\n[u]La capture des doigts[/u] était l’une de mes priorités.\nBeaucoup de solutions accessibles suivent correctement le corps, mais perdent rapidement les mains dès qu’elles tournent, passent devant le visage ou sortent légèrement du cadre. Pour de l’animation, c’est un vrai problème : les gestes des doigts donnent énormément de vie au personnage.\n\nComme je possède plusieurs Kinect V1 et V2, j’ai voulu exploiter leur profondeur et les combiner avec les détections de [i]MediaPipe[/i]. L’objectif final est d’utiliser plusieurs points de vue autour de l’acteur : si une caméra perd une articulation, une autre peut continuer à la suivre.\n\nLe prototype actuel utilise une Kinect V2 comme caméra principale et une caméra classique comme vue secondaire. Les deux produisent un squelette complet, sont recalées dans le même espace 3D et peuvent être comparées dans une visionneuse OpenGL.",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Pourquoi créer mon propre système ?",
              "description": "Au départ, je cherchais simplement un logiciel de motion capture utilisable pour Moderaworld.\nMais les solutions que j’ai testées avaient presque toujours l’un de ces problèmes : abonnement payant, matériel propriétaire, peu de contrôle sur les données ou suivi des mains trop limité.\n\nJe ne cherchais pas seulement à récupérer la position des bras et des jambes.\nPour animer correctement un personnage, je voulais aussi suivre les doigts, le visage et si possible le regard. Je voulais également pouvoir ajouter plusieurs caméras sans être enfermé dans le matériel prévu par un seul logiciel.\n\nJ’ai donc préféré construire mon propre pipeline en Python.\nCela me permet de choisir la source de chaque information : la profondeur peut venir d’une Kinect, le squelette de MediaPipe et une articulation mal visible peut être récupérée depuis une autre caméra.",
              "medias": []
            },
            {
              "title": "Le tracking — Corps, visage, mains et regard",
              "description": "Chaque flux vidéo est analysé avec MediaPipe Holistic.\nLe programme récupère les points du corps, les 478 points du visage et les 21 articulations de chaque main. Le mode `refine_face_landmarks` ajoute aussi les iris, ce qui me permet d’estimer la direction du regard.\n\nLes différentes parties ne sont pas traitées comme des squelettes complètement séparés.\nLe visage reste attaché à la tête, et chaque main reste ancrée sur le poignet détecté dans la pose générale. Leur profondeur est également recalée sur celle du corps pour éviter qu’une main apparaisse soudainement plusieurs mètres devant le personnage.\n\nLe résultat est regroupé dans une structure de squelette commune. Peu importe que les données viennent d’une Kinect ou d’une caméra classique : le reste du programme peut ensuite les manipuler de la même manière.",
              "medias": []
            },
            {
              "title": "La Kinect — Ajouter une vraie profondeur",
              "description": "Une caméra classique peut estimer une pose, mais sa profondeur reste relative.\nLa Kinect V2 apporte une information supplémentaire : sa caméra infrarouge mesure la distance réelle entre le capteur et la scène.\n\nMon module Kinect récupère l’image couleur, l’image infrarouge et la correspondance entre les pixels et l’espace caméra 3D. Pour éviter qu’un point de profondeur incorrect sur un mur ou un objet perturbe tout le squelette, je mesure principalement la distance du torse à partir des épaules et des hanches, puis j’utilise leur médiane.\n\nLes coordonnées normalisées de MediaPipe sont ensuite converties en mètres grâce à cette distance et au champ de vision de la Kinect.\nSi la profondeur matérielle est désactivée ou indisponible, le programme peut utiliser une profondeur de référence afin de continuer à fonctionner avec une webcam classique.\n\nCette séparation est importante pour la suite : je peux utiliser une Kinect lorsqu’une vraie mesure métrique est nécessaire, tout en gardant la possibilité d’ajouter des caméras beaucoup plus simples autour de l’acteur.",
              "medias": []
            },
            {
              "title": "Plusieurs caméras — Voir les gestes sous plusieurs angles",
              "description": "Une seule caméra ne peut pas tout voir.\nLorsqu’un bras passe devant le corps ou qu’une main tourne de profil, certains points deviennent invisibles. Mon objectif est donc de placer plusieurs Kinect et caméras autour de l’acteur, puis de réunir leurs détections.\n\nDans le prototype actuel, une Kinect V2 joue le rôle de caméra maîtresse et une webcam sert de caméra secondaire.\nChaque appareil exécute son propre tracking et produit son propre squelette. L’architecture utilise une interface commune pour que d’autres sources, notamment mes Kinect V1 et V2 supplémentaires, puissent être ajoutées par la suite.\n\nLa version actuelle ne fusionne pas encore automatiquement les deux squelettes articulation par articulation. Elle les place d’abord dans un repère commun et les affiche ensemble. C’est la base nécessaire avant de pouvoir comparer leurs scores et choisir, pour chaque articulation, la mesure la plus fiable.",
              "medias": []
            },
            {
              "title": "La calibration — Mettre toutes les caméras dans le même espace",
              "description": "Pour combiner plusieurs caméras, il faut connaître précisément leur position et leur rotation les unes par rapport aux autres.\nDeux caméras peuvent détecter la même main, mais leurs coordonnées ne représentent pas le même espace.\n\nJ’ai mis en place une calibration avec une mire ChArUco.\nLa mire mélange un damier et des marqueurs ArUco. Lorsqu’elle est visible par les deux caméras, OpenCV calcule sa pose dans chaque image. Le programme peut alors construire une matrice 4 × 4 qui transforme toutes les coordonnées de la caméra secondaire vers le repère de la Kinect maîtresse.\n\nSi la mire n’est pas disponible, j’ai ajouté une méthode de secours basée sur le squelette.\nLe programme utilise les épaules et les hanches détectées par les deux caméras, puis applique l’algorithme de Kabsch pour estimer la rotation et la translation qui alignent les deux torses.\n\nUne fois la matrice calculée, elle est appliquée au corps, au visage et aux deux mains de la caméra secondaire.",
              "medias": []
            },
            {
              "title": "Stabiliser les mains et reconstruire les points perdus",
              "description": "Les mains sont rapides, petites et souvent partiellement cachées. Leurs points ont donc tendance à trembler beaucoup plus que ceux du corps.\nUn lissage trop fort supprime ces tremblements, mais ajoute un retard visible. Un lissage trop faible garde le mouvement réactif, mais rend l’animation instable.\n\nJ’ai créé un filtre adaptatif qui change automatiquement son intensité.\nLorsqu’un point bouge peu, le programme applique un lissage important pour réduire le bruit. Lorsqu’il se déplace rapidement, le filtre devient plus réactif afin de suivre le geste sans trop de retard.\n\nLe système conserve aussi la forme locale du visage et des mains par rapport à leur point d’attache.\nSi MediaPipe perd temporairement une main, ses points peuvent rester reconstruits autour du poignet au lieu de disparaître immédiatement. Dès que la détection revient, le filtre se réinitialise sur les nouvelles valeurs pour éviter un saut trop violent.\n\nChaque partie possède enfin un score tenant compte de sa visibilité, de son tremblement et du nombre de points proches des bords de l’image. Ces scores serviront plus tard à décider quelle caméra est la plus fiable pour chaque articulation.",
              "medias": []
            },
            {
              "title": "La visionneuse 3D — Vérifier l’alignement en temps réel",
              "description": "Pour vérifier le tracking, j’ai créé une visionneuse 3D avec Pygame et OpenGL.\nElle affiche le corps, le visage et les mains avec des couleurs différentes. Les points perdus deviennent gris, ce qui permet de voir immédiatement quand MediaPipe n’arrive plus à suivre une partie.\n\nLe squelette de la Kinect et celui de la caméra secondaire sont affichés simultanément avec deux palettes distinctes.\nAprès la calibration, ils doivent se superposer dans l’espace. Je peux faire tourner la vue et zoomer pour repérer une erreur de profondeur, une mauvaise orientation ou un décalage entre les caméras.\n\nLa visionneuse s’exécute dans un processus séparé et reçoit uniquement les dernières données disponibles dans une file. Le tracking vidéo n’est donc pas ralenti par le rendu OpenGL.",
              "medias": []
            },
            {
              "title": "État actuel — Vers une capture réellement multi-Kinect",
              "description": "En onze jours, j’ai construit les premières briques du système : acquisition Kinect, tracking MediaPipe du corps, du visage et des mains, profondeur métrique, calibration multi-caméras, lissage adaptatif et visualisation 3D.\n\nLe prototype aligne déjà deux sources dans le même espace, mais la fusion finale reste à faire.\nLa prochaine étape est de comparer les scores articulation par articulation, combiner les mesures les plus fiables et utiliser la profondeur des différentes Kinect pour mieux gérer les occultations.\n\nJe veux ensuite enregistrer les mouvements dans un format réutilisable, puis les appliquer directement aux personnages dans Unity.\nL’objectif reste très concret : pouvoir jouer une scène devant plusieurs caméras, récupérer une animation complète — doigts compris — et l’utiliser dans Moderaworld sans passer par un service payant.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "universalmp",
      "title": "UniversalMP",
      "date": "Décembre 2025 – mai 2026",
      "duration": "4 mois",
      "category": [
        "Game Development"
      ],
      "icon": "assets/projects/UniversalMP/icon.jpg",
      "media": "assets/projects/UniversalMP/Image Principale.png",
      "description": "[b]UniversalMP[/b] est un système que j’ai créé pour ajouter une [u]présence multijoueur[/u] à des jeux qui n’ont jamais été prévus pour être joués en ligne.\nLe programme récupère la position, l’orientation, la caméra et l’animation du joueur, envoie ces informations sur le réseau, puis affiche les autres joueurs directement par-dessus le jeu grâce à [i]ReShade[/i].\n\nL’idée m’est venue parce que je voulais faire découvrir Zelda: Skyward Sword à un ami et y jouer avec lui.\nLe jeu est entièrement solo et, à l’époque, je ne savais pas encore créer un véritable mod capable d’ajouter un second joueur dans son moteur. J’ai donc cherché une autre solution : ne pas modifier le monde du jeu, mais afficher un avatar distant suffisamment bien intégré pour donner l’impression qu’il se trouve réellement à l’intérieur.\n\nUniversalMP ne synchronise pas les quêtes, les ennemis ou les objets. Chaque personne joue dans sa propre partie. En revanche, les joueurs peuvent se voir, suivre leurs mouvements et regarder le partage d’écran de l’autre sans quitter le jeu.",
      "medias": [
        "assets/projects/UniversalMP/medias/Video1.mp4",
        "assets/projects/UniversalMP/medias/Video2.mp4"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "L’origine — Jouer ensemble à un jeu entièrement solo",
              "description": "Tout est parti d’une idée assez simple : je voulais faire découvrir Zelda: Skyward Sword à un ami, mais je ne voulais pas seulement le regarder jouer en partage d’écran.\nJe voulais pouvoir lancer ma propre partie, me déplacer à côté de lui et avoir au moins l’impression que nous explorions le jeu ensemble.\n\nLe problème, c’est que Skyward Sword ne possède aucun système multijoueur.\nCréer un vrai mod aurait demandé de comprendre puis de modifier une grande partie du fonctionnement interne du jeu : création d’un second acteur, animations, collisions, caméra, événements et synchronisation du monde. À ce moment-là, je ne savais pas encore faire ce genre de mod.\n\nJ’ai donc pris le problème dans l’autre sens.\nAu lieu d’ajouter réellement un joueur dans le moteur du jeu, j’allais récupérer les informations du joueur local et dessiner l’autre personne par-dessus l’image. Si la position, la caméra et la profondeur étaient correctement reproduites, l’illusion pouvait fonctionner.",
              "medias": []
            },
            {
              "title": "Les premières tentatives — Entrer dans le processus du jeu",
              "description": "Mes premiers prototypes reposaient sur l’injection d’une DLL dans le processus cible.\nJ’ai créé un injecteur avec les API Windows, puis plusieurs bibliothèques capables de s’exécuter directement à côté du jeu et d’inspecter son environnement graphique.\n\nIl fallait ensuite retrouver les données importantes dans la mémoire :\n\n[enum=1]• la position et l’orientation du joueur,[/enum]\n\n[enum=1]• la position, la rotation et le champ de vision de la caméra,[/enum]\n\n[enum=1]• l’état du personnage : immobile, marche, course, attaque, nage ou escalade,[/enum]\n\n[enum=1]• certains états particuliers comme une cinématique ou un écran de pause.[/enum]\n\nLes premières versions utilisaient surtout des offsets et des chaînes de pointeurs trouvés manuellement. Cela fonctionnait, mais le code était très lié au jeu testé et pouvait casser dès que l’organisation de sa mémoire changeait.\n\nCes essais m’ont tout de même permis de valider le point le plus important : je pouvais suivre le joueur en temps réel sans disposer du code source du jeu.",
              "medias": [
                "assets/projects/UniversalMP/medias/Exemple1.jpg",
                "assets/projects/UniversalMP/medias/blender1.png",
                "assets/projects/UniversalMP/medias/blender2.png",
                "assets/projects/UniversalMP/medias/blender3.png"
              ]
            },
            {
              "title": "Les premiers moteurs de rendu — Dessiner le modèle depuis l’addon",
              "description": "Dans les premières versions, le modèle 3D était entièrement rendu par l’addon.\nJe pouvais choisir entre plusieurs moteurs : un renderer CPU fait maison, une variante utilisant un shader CPU et un renderer OpenGL. Chacun chargeait le modèle GLB, ses textures et ses animations, puis essayait de le replacer dans la perspective de la caméra du jeu.\n\nCette méthode m’a permis de valider le concept, mais elle avait deux gros problèmes.\nLe rendu pouvait devenir instable et provoquer des crashs selon le jeu ou l’API graphique utilisée. Il ralentissait aussi le jeu dès que je voulais intégrer correctement le modèle au décor.\n\nPour savoir si un mur devait cacher l’avatar, l’addon devait récupérer la depth map calculée par le jeu. Cette lecture provoquait une interruption du GPU : il fallait attendre la fin de ses commandes, copier la profondeur vers une ressource accessible par le processeur, puis reprendre le rendu.\nCette attente cassait le parallélisme entre le CPU et le GPU et créait des ralentissements visibles.\n\nPlus j’améliorais l’intégration, plus mon addon se transformait en second moteur 3D exécuté à côté de celui du jeu. J’ai donc décidé de déplacer tout le rendu directement sur le GPU, sans récupérer la depth map dans l’addon.",
              "medias": [
                "assets/projects/UniversalMP/medias/VideoBeta.mp4"
              ]
            },
            {
              "title": "Le hack ReShade — Faire tenir un moteur 3D dans un shader",
              "description": "Un shader est normalement un petit programme exécuté par le GPU.\nDans un moteur 3D classique, il reçoit une géométrie déjà préparée et s’occupe surtout de transformer ses sommets ou de calculer la couleur des pixels. Dans ReShade, les shaders servent principalement à appliquer des effets sur l’image finale du jeu : correction des couleurs, netteté, lumière ou post-processing.\n\nUn shader ReShade n’est pas censé charger un fichier GLB, gérer un squelette, lire des animations et rendre un personnage complet. Il ne peut même pas recevoir un modèle 3D en paramètre.\n\nJ’ai donc contourné cette limite en convertissant le modèle et toutes ses animations en une immense texture.\nLes positions des sommets, les normales, les UV, les poids du squelette, les matrices des os et les images des matériaux sont encodés dans ses pixels. La texture devient une sorte de base de données que le shader peut lire sur le GPU.\n\nÀ chaque frame, le shader décode ces pixels, reconstruit les sommets, calcule la pose du squelette, applique l’animation, place le joueur dans le monde puis reproduit la perspective de la caméra avec son FOV.\nIl récupère ensuite la couleur dans l’atlas de textures et calcule l’éclairage du modèle.\n\nCe n’est clairement pas l’usage prévu d’un shader ReShade : je l’utilise comme un véritable moteur 3D animé caché dans un effet de post-processing.\nDans cette V2, l’addon ne dessine plus les joueurs. Il prépare la texture du modèle une fois, puis fournit seulement au shader les informations qui changent : position, rotation, animation, frame, visibilité et paramètres de caméra.",
              "medias": [
                "assets/projects/UniversalMP/medias/model_data.png",
                "assets/projects/UniversalMP/medias/model_texture.png",
                "assets/projects/UniversalMP/medias/Reshade.png"
              ]
            },
            {
              "title": "Les passes de rendu — Couleur, profondeur et ombre",
              "description": "Rendre le modèle dans le shader ne suffit pas : il doit aussi respecter la profondeur du jeu.\nUne depth map est une image dans laquelle chaque pixel indique sa distance par rapport à la caméra. C’est elle qui permet de savoir si l’avatar distant se trouve devant ou derrière un mur.\n\nJ’ai détourné le canal alpha, puis le packing des canaux de sortie, pour transporter la profondeur du modèle en même temps que sa couleur. Le shader effectue ensuite plusieurs passes, comme un petit moteur de rendu :\n\n[enum=1]• une première passe calcule l’ombre du joueur,[/enum]\n\n[enum=1]• une deuxième anime et dessine le modèle dans une texture intermédiaire avec sa propre profondeur,[/enum]\n\n[enum=1]• une dernière passe décode le résultat, le compare à la depth map du jeu et l’intègre dans l’image finale.[/enum]\n\nSi le décor est plus proche de la caméra que le joueur distant, les pixels correspondants sont masqués. L’avatar peut donc passer derrière une colonne, disparaître dans un escalier ou être coupé par un objet comme s’il appartenait réellement à la scène.\n\nToute cette comparaison reste sur le GPU. L’addon n’a plus besoin d’interrompre son travail pour lire la depth map, ce qui supprime le principal ralentissement des premières versions.\nLe résultat combine animation du squelette, perspective, textures, éclairage, ombre et profondeur dans un shader qui, à la base, n’était prévu que pour modifier une image déjà rendue.",
              "medias": [
                "assets/projects/UniversalMP/medias/ImgColor.png",
                "assets/projects/UniversalMP/medias/ImgNormalDepth.png",
                "assets/projects/UniversalMP/medias/ImgDepth.png"
              ]
            },
            {
              "title": "Le réseau — Synchroniser les joueurs sans bloquer le jeu",
              "description": "Les informations du joueur sont envoyées à un serveur sous forme de petits paquets binaires.\nIls contiennent principalement son identifiant, sa position, sa rotation, son animation et quelques états nécessaires au rendu.\n\nLe serveur redistribue ensuite ces paquets aux autres clients.\nLa connexion fonctionne dans un thread séparé avec des sockets non bloquantes et `TCP_NODELAY`, afin que le jeu ne se fige pas pendant un envoi ou une reconnexion.\n\nLes données réseau n’arrivent jamais à un rythme parfaitement régulier.\nPour éviter que les avatars se téléportent à chaque nouveau paquet, UniversalMP conserve une position intermédiaire et interpole progressivement le déplacement et la rotation. Les joueurs distants restent ainsi fluides même lorsque le réseau produit de petits décalages.\n\nLe système gère aussi les déconnexions : lorsqu’un joueur quitte le serveur, son avatar et ses données d’interpolation sont retirés proprement.",
              "medias": [
                "assets/projects/UniversalMP/medias/Network.png"
              ]
            },
            {
              "title": "Le partage d’écran — Voir la partie de l’autre joueur",
              "description": "Comme les deux personnes jouent dans des mondes séparés, il reste utile de pouvoir voir ce qui se passe réellement dans la partie de l’autre.\nJ’ai donc intégré un système de partage d’écran directement dans UniversalMP.\n\nL’addon copie périodiquement le framebuffer du jeu vers une ressource lisible par le processeur. Pour éviter de bloquer le GPU, la copie est lancée sur une frame puis récupérée quelques frames plus tard, une fois qu’elle a eu le temps de se terminer.\n\nL’image est recadrée en 16:9, réduite puis envoyée au serveur à environ 15 images par seconde.\nLes flux des autres joueurs sont conservés dans un cache, transférés dans une texture GPU et affichés dans une fenêtre ReShade.\n\nJe peux choisir le joueur observé, régler l’opacité, déplacer la fenêtre et masquer son interface avec un double-clic. Le partage reste ainsi visible dans le jeu sans nécessiter Discord ou une autre fenêtre par-dessus.",
              "medias": [
                "assets/projects/UniversalMP/medias/ShareScreen.jpg",
                "assets/projects/UniversalMP/medias/ShareScreen2.png"
              ]
            },
            {
              "title": "La limite du concept — Deux parties, pas un monde partagé",
              "description": "UniversalMP donne une présence multijoueur, mais ce n’est pas un véritable mod multijoueur.\nChaque joueur reste dans sa propre sauvegarde et son propre monde.\n\nLe système ne synchronise pas :\n\n[enum=1]• les ennemis et leurs points de vie,[/enum]\n\n[enum=1]• les quêtes et les cinématiques,[/enum]\n\n[enum=1]• les objets ramassés ou déplacés,[/enum]\n\n[enum=1]• les changements permanents de la carte.[/enum]\n\nSi une personne ouvre une porte, elle ne s’ouvre pas automatiquement chez l’autre. Si un combat commence, chacun affronte ses propres ennemis.\n\nCette limite était volontaire.\nMon objectif initial était de pouvoir explorer un jeu solo avec un ami sans reconstruire toute sa logique interne. L’overlay, la depth map et le partage d’écran suffisaient pour créer cette sensation, tout en restant applicables à des jeux très différents.",
              "medias": []
            },
            {
              "title": "UniversalMP Core — Séparer le jeu du système multijoueur",
              "description": "Les premières versions mélangeaient tout dans un même addon : lecture de mémoire, réseau, rendu, animations et partage d’écran.\nCela fonctionnait pour un jeu précis, mais chaque nouvelle adaptation demandait de copier puis de modifier une grande partie du projet.\n\nJ’ai donc séparé l’architecture en deux addons.\n\n`UniversalMP_Core` est entièrement générique. Il ne lit jamais directement la mémoire du jeu. Il s’occupe du serveur, du réseau, de l’interpolation, du partage d’écran et de la communication avec le shader. Il convertit le GLB en texture au chargement, l’envoie au GPU, puis met à jour les positions, rotations et animations utilisées par le moteur 3D dans ReShade.\n\nLe `GameBridge` est la seule partie spécifique au jeu. Il retrouve les données en mémoire, convertit les axes, les rotations, le FOV et les animations, puis les publie dans une structure commune.\n\nLes deux addons communiquent grâce à une zone de mémoire partagée attachée au device ReShade. Le bridge écrit les informations du joueur local et le Core les lit sans avoir besoin de connaître le jeu d’origine.\n\nCette séparation m’a permis d’adapter le système à d’autres jeux sans réécrire le cœur multijoueur ni le shader de rendu.",
              "medias": []
            },
            {
              "title": "Le SDK GameBridge — Créer plus facilement un nouvel adaptateur",
              "description": "Pour éviter de recommencer les mêmes outils de reverse engineering à chaque adaptation, j’ai créé un SDK pour les GameBridge.\nLa partie spécifique à un jeu se concentre principalement dans une fonction qui collecte les données puis remplit la structure universelle attendue par le Core.\n\nLe SDK fournit notamment :\n\n[enum=1]• la lecture et l’écriture sécurisées dans la mémoire du processus,[/enum]\n\n[enum=1]• la résolution de chaînes de pointeurs,[/enum]\n\n[enum=1]• le scan de signatures AOB avec des jokers pour retrouver une adresse malgré certains changements,[/enum]\n\n[enum=1]• l’application et la restauration de patchs mémoire,[/enum]\n\n[enum=1]• des conversions de matrices, d’axes, d’angles et de champs de vision,[/enum]\n\n[enum=1]• des filtres pour lisser une position, une rotation ou une vitesse,[/enum]\n\n[enum=1]• une hystérésis permettant de stabiliser les transitions entre idle, marche et course.[/enum]\n\nJ’ai également ajouté des panneaux de debug pour vérifier les adresses, les données brutes et les valeurs envoyées au Core directement depuis l’overlay ReShade.",
              "medias": []
            },
            {
              "title": "État actuel — Le projet qui m’a amené vers de vrais mods",
              "description": "UniversalMP a beaucoup évolué entre les premières DLL injectées et l’architecture Core/GameBridge.\nLe projet possède maintenant son propre rendu de modèles animés dans un shader ReShade, un serveur multijoueur, un partage d’écran et un SDK pour adapter plus facilement le système à un nouveau jeu.\n\nIl reste volontairement limité à une présence visuelle.\nPour synchroniser réellement les interactions, il faut aller plus loin : comprendre les acteurs du jeu, ses fonctions internes, ses événements et son moteur d’animation.\n\nAu départ, je voulais simplement voir mon ami courir à côté de moi dans Skyward Sword. Je me suis finalement retrouvé à injecter des DLL, lire la mémoire de plusieurs jeux, écrire un protocole réseau et faire tenir un moteur 3D animé dans un shader ReShade.\nUniversalMP reste un faux multijoueur, mais c’est ce projet qui m’a appris ce qu’il fallait pour passer ensuite à de vrais mods.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "zelda-totk-multiplayer-mod",
      "title": "Zelda TOTK Multiplayer Mod",
      "date": "Mars 2026",
      "duration": "1 mois",
      "category": [
        "Game Development",
        "AI"
      ],
      "icon": "assets/projects/zelda-totk-multiplayer-mod/icon.jpg",
      "media": "assets/projects/zelda-totk-multiplayer-mod/Video.mp4",
      "description": "[b]Zelda TOTK Multiplayer Mod[/b] est un [u]véritable mod multijoueur[/u] pour The Legend of Zelda: Tears of the Kingdom.\nContrairement à [projet=universalmp]UniversalMP[/projet], le joueur distant n’est pas un modèle dessiné par-dessus l’image. Le mod crée un vrai acteur dans le moteur du jeu, puis contrôle sa position, sa rotation et son squelette avec les données reçues sur le réseau.\n\nChaque joueur continue d’exécuter sa propre instance de TOTK, mais il voit l’autre sous la forme d’un acteur de Zelda réellement présent dans son monde. Le personnage est rendu par le jeu lui-même, utilise son système d’animation et suit le même pipeline graphique que les autres acteurs.\n\nComme le code source de TOTK n’est pas disponible, j’ai dû retrouver moi-même les fonctions liées au spawn, aux transformations, aux chargements et au squelette. Le projet réunit donc un mod C++ injecté avec ExLaunch, un travail important de [i]reverse engineering ARM64[/i], une passerelle Windows, un protocole réseau et une version modifiée de Yuzu.\n\nÀ l’attention de Nintendo : ce projet fan non officiel, sans affiliation ni approbation de Nintendo, est un prototype personnel, non distribué et non commercial, réalisé uniquement dans un but d’apprentissage et de présentation de mes compétences. The Legend of Zelda: Tears of the Kingdom ainsi que ses éléments visuels appartiennent à Nintendo. Les captures présentées servent exclusivement à illustrer le fonctionnement technique du prototype. Les analyses statiques et dynamiques ont été réalisées à partir d’une copie acquise légalement et portent uniquement sur les éléments nécessaires au fonctionnement et à l’interopérabilité du projet. Aucun code, fichier, clé ou asset appartenant à Nintendo n’est distribué. Si cette démonstration pose problème, merci de me le signaler cordialement ; je la retirerai rapidement.",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "L’origine — Dépasser les limites d’UniversalMP",
              "description": "UniversalMP m’avait permis d’afficher un autre joueur dans presque n’importe quel jeu, sans créer de véritable mod.\nLe résultat fonctionnait visuellement, mais le personnage restait extérieur au moteur : le jeu ne connaissait pas son existence, ne gérait pas son squelette et ne pouvait pas le traiter comme un acteur normal.\n\nAvec TOTK, j’ai voulu franchir cette limite.\nCette fois, je ne voulais plus reproduire le rendu d’un joueur dans un overlay. Je voulais demander directement au moteur de Tears of the Kingdom de créer un second personnage, puis reprendre le contrôle de cet acteur pour lui appliquer les mouvements reçus sur le réseau.\n\nCela change complètement la nature du problème.\nIl ne suffit plus de connaître la caméra et la position du joueur. Il faut comprendre comment le jeu crée un acteur, où il stocke ses transformations, comment il met à jour son animation, ce qui se passe pendant un chargement et pourquoi le moteur décide parfois de supprimer un personnage.",
              "medias": []
            },
            {
              "title": "Le reverse engineering — Travailler sans le code source du jeu",
              "description": "TOTK est compilé pour l’architecture ARM64 de la Nintendo Switch et ne fournit naturellement aucun symbole ni documentation interne.\nPour modifier son fonctionnement, j’ai extrait le binaire principal puis je l’ai analysé avec Ghidra, GDB et l’assembleur AArch64.\n\nLe travail consiste à partir d’un comportement visible, puis à remonter jusqu’à la fonction responsable.\nPour retrouver la position du joueur, par exemple, j’ai suivi les écritures vers les données de rapport du jeu, observé les registres utilisés au moment de l’écriture et identifié le pointeur vers la transformation complète de Link.\n\nJ’ai utilisé la même méthode pour le spawn des acteurs, le rendu, les chargements, la suppression des personnages et l’écriture des poses du squelette.\nLes hypothèses étaient testées avec des breakpoints, des watchpoints, des modifications temporaires d’instructions et de petits hooks. Lorsqu’une instruction était supprimée et que l’animation de Link se figeait, je savais enfin que j’avais trouvé le bon niveau du pipeline.\n\nCe travail m’a aussi obligé à comprendre les conventions d’appel ARM64, les registres SIMD, les vtables, les structures sans type et la conversion entre les adresses Ghidra et les offsets réellement utilisés par ExLaunch.",
              "medias": []
            },
            {
              "title": "Les agents LLM — Transformer une décompilation immense en pistes exploitables",
              "description": "Analyser manuellement tout le binaire de TOTK aurait pris un temps énorme.\nJ’ai donc construit un pipeline utilisant plusieurs agents LLM pour m’aider à trier et reconstruire une partie du code décompilé.\n\nDes scripts découpent les sorties de Ghidra en centaines de rapports, extraient les appels entre fonctions, les chaînes de caractères, les accès mémoire, les offsets et les valeurs de retour. Les agents travaillent ensuite sur ces morceaux pour :\n\n[enum=1]• proposer le rôle probable des fonctions,[/enum]\n\n[enum=1]• reconstruire des structures d’acteurs, de joueurs et de NPC,[/enum]\n\n[enum=1]• retrouver les chaînes d’appels autour d’un comportement précis,[/enum]\n\n[enum=1]• comparer plusieurs fonctions qui manipulent les mêmes offsets,[/enum]\n\n[enum=1]• produire une documentation plus lisible que la décompilation brute.[/enum]\n\nLes agents ne décident pas seuls qu’une adresse est correcte.\nLeurs résultats servent surtout à réduire la zone de recherche et à proposer des candidats. Je vérifie ensuite les passages importants dans l’assembleur AArch64, puis directement pendant l’exécution avec GDB et des hooks de test.\n\nCette combinaison m’a permis de passer d’un binaire presque illisible à une documentation exploitable sur le spawn, les transformations et le pipeline d’animation.",
              "medias": [
                "assets/projects/zelda-totk-multiplayer-mod/imgs/Files.png",
                "assets/projects/zelda-totk-multiplayer-mod/imgs/ExFile.png"
              ]
            },
            {
              "title": "Le mod ExLaunch — Exécuter mon propre C++ dans TOTK",
              "description": "Le cœur du projet est un mod natif écrit en C++ avec ExLaunch.\nIl est chargé dans le même processus que le jeu et peut donc lire ses structures, appeler ses fonctions et intercepter son exécution.\n\nJ’utilise deux types de hooks.\nLes hooks trampoline remplacent temporairement une fonction entière, exécutent mon code puis rappellent la fonction originale. Les hooks inline interviennent au milieu d’une fonction, à un endroit précis de l’assembleur, tout en reproduisant l’instruction qui a été remplacée.\n\nLe mod installe notamment des hooks sur :\n\n[enum=1]• la mise à jour des entrées, utilisée comme boucle principale,[/enum]\n\n[enum=1]• la fonction de création des acteurs,[/enum]\n\n[enum=1]• l’écriture de la position du joueur,[/enum]\n\n[enum=1]• la copie des matrices de rendu,[/enum]\n\n[enum=1]• l’écriture et la sortie des poses du squelette,[/enum]\n\n[enum=1]• les chargements et les demandes de suppression d’acteurs.[/enum]\n\nChaque hook est défensif : les pointeurs, plages mémoire, compteurs et valeurs flottantes sont vérifiés avant d’être utilisés. Une mauvaise adresse dans ce contexte ne produit pas une simple erreur : elle peut faire planter tout le jeu.",
              "medias": []
            },
            {
              "title": "Le spawn — Créer un véritable acteur dans le monde",
              "description": "Faire apparaître Zelda n’a pas consisté à appeler une fonction avec son nom et une position.\nLa fonction de spawn attend un contexte complexe rempli par le moteur. Une partie de ses données pointe vers des objets vivants, et d’autres champs peuvent encore être utilisés après le retour de la fonction.\n\nJ’ai donc hooké les spawns normaux du jeu afin de capturer un contexte valide lorsqu’un acteur stable est créé.\nLe mod copie ensuite une large zone du paramètre de spawn, déplace dans son propre buffer les pointeurs qui visaient l’ancienne pile, modifie uniquement la position puis rappelle la fonction originale du moteur avec le nom de l’acteur de Zelda.\n\nLes buffers utilisés pour ces paramètres restent volontairement en mémoire.\nLe jeu peut conserver leurs adresses après la création de l’acteur ; réutiliser trop tôt le même espace provoquait des corruptions et des crashs difficiles à reproduire. J’ai donc mis en place une réserve de buffers persistants qui ne sont jamais écrasés pendant la partie.\n\nUne fois le spawn terminé, le mod récupère l’acteur réellement créé par TOTK et commence à suivre son owner, ses composants, sa transformation et ses objets de rendu.",
              "medias": []
            },
            {
              "title": "Le suivi — Contrôler l’acteur sans que le jeu reprenne la main",
              "description": "Un acteur créé par le moteur continue normalement d’obéir à son IA, à la physique et à son propre cycle de vie.\nPour en faire le joueur distant, je dois remplacer ces décisions par les données reçues sur le réseau.\n\nLe mod écrit la position et la rotation dans plusieurs niveaux validés de la transformation, puis appelle les fonctions internes utilisées par le jeu pour appliquer ces changements.\nIl désactive aussi la gravité et certaines collisions de Zelda afin d’éviter que la physique locale lutte en permanence contre la position distante.\n\nL’acteur doit également survivre aux transitions du jeu.\nTOTK peut l’endormir, le supprimer lorsqu’il est trop loin ou le détruire pendant un chargement. Plusieurs hooks surveillent donc les demandes de reset, de sleep et de suppression. Si Zelda disparaît, le mod attend la fin du chargement, vérifie que le contexte de spawn est de nouveau disponible puis la recrée automatiquement.\n\nCette partie a demandé beaucoup d’itérations : un personnage peut sembler fonctionner pendant plusieurs minutes, puis devenir invalide parce qu’un pointeur a été réutilisé ou parce que le moteur a remplacé l’objet derrière la même adresse.",
              "medias": []
            },
            {
              "title": "Le squelette — Reproduire les mouvements du joueur distant",
              "description": "Synchroniser seulement la position ferait glisser Zelda sur le sol sans reproduire les mouvements de Link.\nJe voulais transmettre la pose complète : jambes, bras, torse, tête et changements de posture.\n\nJ’ai retrouvé la fonction bas niveau qui écrit chaque os du squelette, puis une seconde route où la pose complète est prête juste avant son utilisation par le rendu.\nLe mod capture alors les matrices locales du squelette de Link et les publie dans le canal réseau.\n\nLes squelettes de Link et de Zelda ne sont pas identiques.\nIls n’ont ni le même nombre d’os, ni toujours les mêmes proportions. Copier toutes les matrices directement déformait donc le personnage. J’ai créé une table de correspondance entre les deux rigs et je transfère principalement la rotation des os, tout en conservant les translations locales propres à Zelda.\n\nCertains mouvements, comme l’accroupissement, nécessitent tout de même un déplacement vertical du corps. Je calcule alors seulement le delta utile par rapport à la pose de référence et je l’applique séparément.\n\nLes poses reçues sont enfin interpolées avant d’être écrites dans le squelette de Zelda. Le résultat reste fluide même si les paquets arrivent avec un rythme irrégulier.",
              "medias": [
                "assets/projects/zelda-totk-multiplayer-mod/imgs/Squelette.gif"
              ]
            },
            {
              "title": "Le pont mémoire — Relier le mod ARM64 au programme Windows",
              "description": "Le mod s’exécute dans la mémoire émulée de la Switch, tandis que le réseau et l’interface fonctionnent côté Windows.\nJ’ai donc créé une structure partagée servant de bus entre les deux environnements.\n\nCette zone possède une signature reconnaissable, une version de protocole, des heartbeats et quatre canaux :\n\n[enum=1]• transformation locale,[/enum]\n\n[enum=1]• transformation distante,[/enum]\n\n[enum=1]• squelette local,[/enum]\n\n[enum=1]• squelette distant.[/enum]\n\nLe programme hôte retrouve la signature dans la mémoire de l’émulateur, lit les données produites par le mod puis écrit les informations reçues de l’autre joueur.\n\nComme les deux côtés peuvent accéder à la structure au même moment, chaque canal utilise des compteurs de séquence.\nLe lecteur vérifie que le compteur est identique avant et après la copie et qu’aucune écriture n’était en cours. Cela évite de mélanger la moitié d’une ancienne pose avec la moitié de la suivante.",
              "medias": []
            },
            {
              "title": "Le réseau — UDP, Steam P2P et interpolation",
              "description": "La position et le squelette n’ont pas les mêmes contraintes réseau.\nUne transformation est petite et doit être envoyée souvent. Une pose complète contient plusieurs centaines de matrices et ne tient pas proprement dans un seul paquet UDP.\n\nJ’ai donc créé un protocole binaire avec plusieurs types de paquets.\nLes transformations sont envoyées directement avec leur numéro de séquence. Les squelettes sont découpés en fragments, numérotés, puis réassemblés uniquement lorsque tous les morceaux du même snapshot sont arrivés.\nLes anciens paquets et les doublons sont ignorés.\n\nJ’ai testé deux modes de connexion : un serveur relais UDP et Steam Networking.\nLa version Steam permet de créer une room, afficher les salons disponibles, rejoindre un autre joueur et inviter un ami sans avoir à configurer manuellement les ports du routeur.\n\nCôté réception, les snapshots sont conservés dans de petites files temporelles.\nLe programme affiche volontairement un état légèrement en retard afin de pouvoir interpoler entre deux paquets connus. Les téléportations trop importantes sont détectées et appliquées immédiatement, tandis que les déplacements normaux et les poses du squelette sont lissés.",
              "medias": [
                "assets/projects/zelda-totk-multiplayer-mod/imgs/UDP.png",
                "assets/projects/zelda-totk-multiplayer-mod/imgs/P2P.png"
              ]
            },
            {
              "title": "Yuzu modifié — Intégrer le gateway directement à l’émulateur",
              "description": "Au début, la passerelle réseau fonctionnait comme un programme séparé qui scannait la mémoire de l’émulateur.\nPour mieux intégrer le projet, j’ai également modifié le code source de Yuzu.\n\nJ’ai ajouté un overlay ImGui directement dans son renderer Vulkan, ainsi que la gestion de la souris, du clavier et du texte depuis la fenêtre Qt de l’émulateur.\nYuzu expose maintenant une petite API de callbacks permettant à ma DLL d’utiliser le même contexte ImGui et d’afficher son interface au-dessus du jeu.\n\nL’émulateur peut charger automatiquement `MyMod.dll` au démarrage.\nCette DLL lance la passerelle mémoire et affiche l’état du mod, de la connexion réseau et du joueur distant. L’interface permet aussi de scanner le bus, se connecter à un serveur ou gérer les rooms Steam.\n\nModifier Yuzu m’a évité d’empiler plusieurs fenêtres et m’a donné un point d’intégration propre entre le rendu Vulkan, l’interface et le programme hôte.",
              "medias": []
            },
            {
              "title": "Se retrouver dans Hyrule — Marqueur, distance et chargements",
              "description": "Même avec un joueur distant correctement synchronisé, le monde de TOTK est immense.\nSi les deux personnes s’éloignent, il devient difficile de savoir où retrouver l’autre et le jeu peut supprimer l’acteur devenu trop lointain.\n\nJ’ai donc réutilisé un marqueur rouge de la carte.\nLorsqu’il est présent, le mod bloque sa suppression automatique puis met à jour sa position avec celle du joueur distant. Le marqueur suit ainsi l’autre personne sur la carte sans nécessiter une nouvelle interface propre au jeu.\n\nLe système prend aussi la distance en compte avant de recréer Zelda.\nSi le joueur distant est trop loin, le mod attend plutôt que de faire apparaître un acteur dans une zone qui ne devrait pas être chargée. Il peut également téléporter le joueur local vers la position distante pour faciliter les tests et les retrouvailles.\n\nCes fonctions sont moins spectaculaires que le squelette ou le réseau, mais elles sont indispensables pour que le prototype reste utilisable en dehors d’une petite zone de démonstration.",
              "medias": [
                "assets/projects/zelda-totk-multiplayer-mod/imgs/Balise.png"
              ]
            },
            {
              "title": "État actuel — Un vrai joueur, pas encore un monde entièrement partagé",
              "description": "Le projet sait aujourd’hui créer un acteur réel dans TOTK, suivre son cycle de vie, lui appliquer la position, la rotation et le squelette d’un autre joueur, puis conserver cette synchronisation à travers une connexion UDP ou Steam P2P.\n\nCe n’est pas encore un mode coopération complet.\nLes deux instances possèdent toujours leurs propres ennemis, objets, quêtes et événements. Synchroniser tout Hyrule demanderait d’identifier beaucoup d’autres systèmes internes et de décider quelle instance contrôle chaque élément du monde.\n\nLa différence avec UniversalMP reste malgré tout fondamentale : Zelda n’est pas une image ajoutée après le rendu. Elle existe dans les structures du jeu, possède un vrai squelette et passe par les fonctions de TOTK.\n\nAu départ, je voulais simplement remplacer mon overlay par un vrai personnage. J’ai fini par modifier le jeu, l’émulateur et toute la chaîne entre les deux. Le mod est encore un prototype, mais cette fois je n’imite plus un joueur à l’extérieur du jeu : j’en crée un directement à l’intérieur.",
              "medias": [
                "assets/projects/zelda-totk-multiplayer-mod/imgs/img.png"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "projectorai",
      "title": "ProjectorAI",
      "date": "Juin 2026 – aujourd’hui",
      "duration": "2 semaines",
      "category": [
        "AI",
        "Tools"
      ],
      "icon": "",
      "media": "",
      "description": "[b]ProjectorAI[/b] est un logiciel de [u]texturing 3D assisté par intelligence artificielle[/u] que je développe en C++ avec OpenGL et ImGui.\nSon objectif est de prendre un modèle GLB, de le photographier depuis plusieurs projecteurs virtuels, d’envoyer ces vues à [i]ComfyUI[/i], puis de reprojeter les images générées dans les textures du modèle.\n\nJ’ai commencé ce projet pour [projet=moderaworld]Moderaworld[/projet]. Mon premier système existait sous la forme d’un addon Blender, mais il devenait trop difficile à contrôler et mélangeait des outils qui n’avaient pas été pensés pour travailler ensemble.\nJ’ai donc préféré repartir de zéro et créer un logiciel entièrement consacré à ce pipeline.\n\nProjectorAI n’est pas seulement un viewer qui envoie une capture à une IA. Il gère le modèle, ses textures, sa pose, les projecteurs, plusieurs passes de rendu, les workflows ComfyUI, la peinture projective et l’export final. L’idée est de garder tout le travail dans une seule application, sans devoir passer constamment de Blender à ComfyUI puis à un éditeur d’images.",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "L’origine — Remplacer mon addon Blender",
              "description": "Le premier prototype de projection fonctionnait directement dans Blender.\nJe plaçais des caméras autour du modèle, je générais une image avec ComfyUI, puis je la projetais sur la surface pour peindre la texture.\n\nLe problème n’était pas vraiment le résultat, mais tout ce qu’il fallait faire autour.\nChaque angle demandait de déplacer la caméra, préparer les bonnes passes, lancer le workflow, récupérer l’image, régler la projection et vérifier les coutures dans les UV. Dès que je voulais utiliser des paramètres différents pour le visage, les cheveux ou les vêtements, l’organisation devenait vite pénible.\n\nProjectorAI est né de cette limite.\nAu lieu d’adapter mon idée au fonctionnement de Blender, j’ai construit l’interface autour de mon besoin : le modèle au centre, des projecteurs indépendants autour de lui et un pipeline complet allant de la capture jusqu’à l’export.",
              "medias": []
            },
            {
              "title": "Le modèle — Un éditeur GLB intégré",
              "description": "ProjectorAI charge directement les modèles GLB et conserve leur structure d’origine : géométrie, matériaux, textures, armature et morph targets.\nLe rendu principal utilise OpenGL avec un shader Unlit/Cutout, ce qui permet d’afficher correctement les cheveux, les vêtements fins et les surfaces utilisant de la transparence.\n\nJ’ai ensuite ajouté un véritable éditeur de modèle.\nIl permet de sélectionner les différentes parties du mesh, masquer ou supprimer une primitive, changer les matériaux, modifier les textures et travailler sur plusieurs calques.\n\nLe logiciel gère aussi la pose :\n\n[enum=1]• affichage et sélection des os du squelette,[/enum]\n\n[enum=1]• rotation ou déplacement avec des gizmos,[/enum]\n\n[enum=1]• modification des morph targets,[/enum]\n\n[enum=1]• création de presets de pose réutilisables.[/enum]\n\nC’était important pour moi de pouvoir préparer exactement l’angle et l’expression du personnage avant la génération, sans devoir retourner dans un autre logiciel.",
              "medias": []
            },
            {
              "title": "Les projecteurs — Photographier le modèle sous tous les angles",
              "description": "Le cœur du logiciel repose sur des projecteurs virtuels placés autour du modèle.\nUn projecteur possède sa propre position, sa rotation, son champ de vision et sa résolution. Il peut être créé depuis la caméra libre, déplacé indépendamment, puis utilisé comme une caméra fixe pour capturer le modèle.\n\nChaque capture produit plusieurs rendus :\n\n[enum=1]• Color Unlit, pour récupérer la couleur brute du modèle,[/enum]\n\n[enum=1]• Depth Map, pour connaître la distance de chaque pixel,[/enum]\n\n[enum=1]• Canny et Lineart, pour conserver les formes et les détails,[/enum]\n\n[enum=1]• Outline, pour isoler la silhouette.[/enum]\n\nLa profondeur est recalculée par rapport à la partie visible du modèle, ce qui évite d’obtenir une image presque noire lorsque la caméra est éloignée.\nLes projecteurs sont visibles dans la scène avec leur frustum et peuvent afficher directement leur capture sur un rectangle, comme de petits écrans placés autour du personnage.\n\nLe fait qu’ils soient indépendants change beaucoup de choses : je peux préparer une configuration pour le visage, une autre pour le dos, puis revenir exactement sur les mêmes cadrages plus tard.",
              "medias": []
            },
            {
              "title": "ComfyUI — Un workflow différent pour chaque projecteur",
              "description": "ComfyUI est un outil nodal de génération d’images qui permet de construire des pipelines avec Stable Diffusion, ControlNet, des LoRA et différents modèles de traitement.\nDans ProjectorAI, je ne passe pas manuellement d’un logiciel à l’autre : l’application communique directement avec le serveur ComfyUI grâce à son API.\n\nChaque projecteur possède son propre workflow au format API JSON. Je peux charger un workflow existant, le copier vers un autre projecteur ou l’éditer directement dans ProjectorAI avec un graph inspiré de l’interface de ComfyUI.\n\nLe logiciel reconnaît les nodes que j’utilise le plus souvent : chargement de modèle, prompts CLIP, ControlNet, Canny, KSampler, VAE, LoRA et sauvegarde d’image. Les nodes inconnus ne sont pas supprimés : ils restent dans le fichier pour que le workflow puisse continuer à fonctionner même si mon éditeur ne sait pas encore les modifier.\n\nConcrètement, je clique sur le bouton « Génération » dans ProjectorAI. Le logiciel injecte les captures du projecteur dans les bons nodes, envoie le workflow par API, suit la progression de chaque étape et récupère automatiquement les images produites. Je peux ensuite choisir l’un des résultats comme preview du projecteur.\n\nCette organisation permet d’utiliser un workflow très précis pour le visage et un autre pour les vêtements, sans devoir ouvrir ou reconfigurer ComfyUI à chaque changement de vue.",
              "medias": []
            },
            {
              "title": "La projection — Transformer l’image générée en texture",
              "description": "Une image générée depuis un angle ne peut pas simplement être collée sur la texture.\nIl faut retrouver quel pixel de l’image correspond à quelle position du modèle, ignorer les surfaces cachées et éviter de peindre à travers le personnage.\n\nProjectorAI réalise donc un bake de la preview du projecteur dans les UV du modèle.\nLa projection utilise la caméra du projecteur, la profondeur et la géométrie pour ne conserver que les pixels réellement visibles depuis ce point de vue. Le résultat est stocké dans un calque temporaire séparé de la texture d’origine.\n\nJe peux ensuite transférer uniquement les zones utiles avec un pinceau projectif. Sa taille, son opacité, son flux et sa dureté sont réglables. Cela permet par exemple de garder uniquement le visage produit par l’IA sans écraser les cheveux ou les vêtements autour.\n\nLe logiciel possède aussi un éditeur de texture plus classique avec pinceau, gomme, remplissage, verrouillage des pixels transparents et historique d’annulation. À la fin, les calques peuvent être fusionnés et réinjectés dans une copie du GLB.",
              "medias": []
            },
            {
              "title": "Sauvegarde et export — Garder tout le projet au même endroit",
              "description": "ProjectorAI utilise son propre format de projet, `.aiproj`.\nIl ne sauvegarde pas uniquement le chemin du modèle : il peut conserver le GLB, les textures de base, les calques de peinture, la visibilité des meshes, les matériaux modifiés, la pose, les morph targets, les presets et la configuration des projecteurs avec leurs workflows.\n\nL’objectif est de pouvoir rouvrir un personnage et retrouver exactement le même environnement de travail, même si les fichiers d’origine ont été déplacés.\n\nUne fois le texturing terminé, le logiciel exporte un nouveau GLB dans lequel les calques peints sont fusionnés avec les textures du modèle.\nLe résultat peut ensuite être utilisé dans Unity, Blender ou n’importe quel moteur compatible glTF, sans dépendre de ProjectorAI pour l’affichage.",
              "medias": []
            },
            {
              "title": "État actuel — Un prototype déjà utilisable",
              "description": "ProjectorAI est encore jeune, mais le pipeline principal fonctionne déjà : charger un modèle, préparer une pose, placer des projecteurs, capturer les différentes passes, lancer ComfyUI, récupérer le rendu, le projeter et exporter le modèle texturé.\n\nIl reste encore beaucoup de travail sur l’ergonomie, les coutures entre plusieurs projections, la gestion des zones jamais visibles et l’automatisation de certaines étapes.\nJe veux aussi intégrer plus tard [projet=neural-rendering]Neural Rendering[/projet], afin que ProjectorAI puisse produire des modèles dont l’apparence ne dépend plus d’une seule texture fixe.\n\nLe projet est parti d’un besoin très précis pour Moderaworld, mais je pense que l’outil peut être utile bien au-delà.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "neural-rendering",
      "title": "Neural Rendering",
      "date": "Juin 2026 – aujourd’hui",
      "duration": "2 semaines",
      "category": [
        "AI"
      ],
      "icon": "assets/projects/NeuralRendering/icon.jpg",
      "media": "assets/projects/NeuralRendering/Demo.mp4",
      "description": "[b]Neural Rendering[/b] est un projet de recherche que j’ai commencé pour résoudre un problème rencontré sur [projet=moderaworld]Moderaworld[/projet] : même avec une très bonne texture et un shader toon, [u]un modèle 3D ressemble encore à un modèle 3D[/u].\n\nDans une animation dessinée à la main, le rendu n’est pas physiquement stable.\nLes contours, les ombres, les proportions et parfois même les couleurs changent selon l’angle pour produire l’image la plus lisible ou la plus belle. Une texture 3D classique ne peut pas faire cela : un point du modèle garde la même couleur, quelle que soit la caméra.\n\nMon objectif est donc de créer un modèle 3D capable d’apprendre son apparence selon le point de vue.\nJe me suis inspiré des [i]NeRF[/i], qui utilisent un réseau de neurones pour prédire la couleur et la densité d’un point de l’espace selon la direction de la caméra. Mais je n’ai pas repris leur fonctionnement tel quel : je conserve la géométrie, les UV et l’armature du modèle GLB. Seule la manière de produire sa couleur devient neuronale.\n\nJ’ai développé deux versions très différentes.\nLa [b]V1[/b] colorise l’image entière en post-processing avec un gros réseau partagé. La [b]V2[/b] déplace au contraire l’intelligence dans la texture : chaque texel possède son propre mini-modèle, exécuté directement par le shader.",
      "medias": [
        "assets/projects/NeuralRendering/medias/FullTuto.mp4",
        "assets/projects/NeuralRendering/medias/GifEx.gif"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Le point de départ — Pourquoi un shader toon ne suffit pas",
              "description": "Les techniques classiques de NPR, comme les outlines ou les ombres en paliers, améliorent beaucoup le rendu d’un modèle 3D.\nMais elles ne changent pas le problème principal : la surface reste fixe.\n\nSur un dessin, l’artiste peut tricher volontairement.\nDe face, il place les yeux d’une certaine manière. De profil, il déplace une mèche ou agrandit un élément pour que la silhouette reste lisible. Une ombre peut être dessinée à un endroit qui n’est pas physiquement exact, simplement parce que l’image fonctionne mieux ainsi.\n\nJe voulais que le modèle apprenne ces choix au lieu d’essayer de les reproduire avec une longue liste de règles écrites à la main.\nL’idée est donc de fournir plusieurs rendus de référence autour du personnage, puis de laisser le système apprendre quelle couleur afficher pour chaque angle intermédiaire.",
              "medias": []
            },
            {
              "title": "Première piste — Du Gaussian Splatting vers les NeRF",
              "description": "Avant d’arriver au Neural Rendering, j’ai expérimenté avec le 3D Gaussian Splatting.\nCette technique représente une scène avec un grand nombre de points déformables plutôt qu’avec des triangles. Une gaussienne peut être étirée, orientée et rendue plus ou moins visible selon la caméra. Cela permet de reproduire des détails qui n’existent que depuis certains angles.\n\nLe résultat était intéressant, mais mal adapté à un personnage animé.\nLa qualité dépend directement du nombre de points, les fichiers PLY deviennent vite lourds et surtout les gaussiennes ne sont pas naturellement attachées au squelette du modèle. Les faire suivre proprement une animation aurait demandé de reconstruire une grande partie du système.\n\nJe me suis alors intéressé aux NeRF.\nUn NeRF apprend une fonction continue : on lui donne une position dans l’espace et une direction de vue, puis le réseau prédit une couleur et une densité. Une image est construite en envoyant un rayon dans la scène pour chaque pixel.\n\nDans mon cas, je n’avais pas besoin de reconstruire la géométrie, puisque le modèle 3D existait déjà. J’ai donc gardé le mesh et remplacé uniquement le calcul de sa couleur.",
              "medias": [
                "assets/projects/NeuralRendering/medias/GaussianSplatting.png"
              ]
            },
            {
              "title": "Version 1 — Un réseau neuronal en post-processing",
              "description": "La première version fonctionne comme un filtre neuronal appliqué après le rendu.\nLe moteur affiche d’abord le modèle dans plusieurs buffers qui ne contiennent pas sa couleur finale, mais des informations permettant d’identifier chaque pixel :\n\n[enum=1]• ses coordonnées UV,[/enum]\n\n[enum=1]• sa normale par rapport à la caméra,[/enum]\n\n[enum=1]• l’identité de la primitive du mesh.[/enum]\n\nCes huit valeurs passent dans un encodage de Fourier. Les coordonnées UV sont transformées avec plusieurs fréquences de sinus et de cosinus, ce qui aide le réseau à apprendre des détails fins plutôt qu’une simple couleur moyenne.\n\nLe modèle LibTorch utilise ensuite une architecture `40 → 256 → 256 → 256 → 256 → 3` avec une connexion résiduelle. Les trois valeurs de sortie correspondent à la couleur RGB du pixel.\nCUDA est utilisé pour l’entraînement et l’inférence lorsqu’il est disponible.\n\nUne fois le G-buffer généré, chaque pixel visible de l’image traverse ce réseau, puis le résultat est réinjecté en post-processing.",
              "medias": [
                "assets/projects/NeuralRendering/medias/Render1.png",
                "assets/projects/NeuralRendering/medias/Render2.png",
                "assets/projects/NeuralRendering/medias/Render3.png",
                "assets/projects/NeuralRendering/medias/Render4.png",
                "assets/projects/NeuralRendering/medias/Render5.png"
              ]
            },
            {
              "title": "Entraîner la V1 — Apprendre depuis plusieurs vues",
              "description": "Pour entraîner le réseau, j’ai créé plusieurs méthodes de génération de dataset.\nJe peux ajouter manuellement la vue actuelle, générer automatiquement des caméras orbitales autour du modèle ou rasteriser directement les triangles dans l’espace UV.\n\nChaque exemple associe les informations géométriques d’un pixel à une couleur cible.\nLa cible peut venir de la texture originale ou d’une image générée avec ComfyUI, un outil nodal permettant de construire des workflows autour de Stable Diffusion et ControlNet.\n\nIci encore, tout est piloté par l’API : un bouton dans mon application capture le modèle, injecte l’image dans le workflow ComfyUI, lance la génération et récupère le résultat. Je peux ensuite ajouter directement cette image au dataset, sans changer de logiciel.\n\nL’entraînement s’exécute dans un thread séparé afin de garder l’interface utilisable. Le programme affiche la progression, la loss et une estimation du temps restant, puis repasse automatiquement sur le rendu neuronal une fois l’optimisation terminée.\n\nCette version m’a permis de valider l’idée : le réseau peut remplacer la texture et reconstruire une apparence différente selon les informations reçues.",
              "medias": []
            },
            {
              "title": "Les limites de la V1 — Un seul modèle pour tous les pixels",
              "description": "Le principal problème de la V1 est son architecture centralisée.\nToutes les textures, tous les angles et tous les pixels du modèle doivent être mémorisés dans un seul réseau neuronal.\n\nC’est un peu comme compresser toutes les apparences du personnage dans une même boîte.\nPlus je lui demande de retenir de détails, plus le réseau doit être grand et plus son calcul devient lent. Et comme le modèle complet est exécuté pour chaque pixel affiché, la latence augmente très vite avec la résolution de l’écran.\n\nSur une image fixe, le résultat pouvait être intéressant. En temps réel, il était beaucoup trop lent.\nLa capacité posait aussi problème : ajouter de nouvelles textures ou de nouveaux angles pouvait dégrader ce que le réseau avait déjà appris.\n\nIl me fallait donc conserver le principe d’une couleur dépendante de la caméra, mais supprimer le gros réseau partagé.",
              "medias": []
            },
            {
              "title": "Version 2 — Un mini-modèle dans chaque texel",
              "description": "La V2 inverse complètement l’approche.\nAu lieu d’avoir un réseau qui connaît tout le modèle, chaque texel de chaque primitive possède son propre petit modèle indépendant.\n\nUn mini-modèle contient 36 coefficients : neuf bases directionnelles et trois informations liées à la position locale du mesh, chacune produisant les trois couleurs RGB.\nLa direction de la caméra est combinée à la normale du pixel, puis transformée en plusieurs bases proches du principe des harmoniques sphériques. Le mini-modèle peut ainsi apprendre qu’un texel doit être clair de face, sombre de côté ou prendre une autre couleur depuis un angle précis.\n\nLes coefficients sont rangés dans une texture `RGBA16F` sous la forme d’un atlas 4 × 3.\nIl n’existe plus de couches entièrement connectées ni de décodeur partagé entre les pixels. Pendant le rendu, le fragment shader lit les quatre mini-modèles voisins, calcule leur couleur puis interpole le résultat pour éviter un rendu pixelisé.\n\nLe modèle conserve quand même les informations utiles du GLB d’origine, notamment l’alpha cutout et les normal maps.",
              "medias": [
                "assets/projects/NeuralRendering/medias/RenderComfyUI.png",
                "assets/projects/NeuralRendering/medias/RenderComfyUI 2.png"
              ]
            },
            {
              "title": "Entraîner la V2 — Modifier uniquement les texels observés",
              "description": "L’entraînement de la V2 est local.\nLorsqu’un exemple correspond à un texel, seuls les coefficients de ce texel sont modifiés. Tous les autres restent exactement dans leur état précédent.\n\nCela évite une grande partie du problème d’oubli de la V1.\nJe peux ajouter une nouvelle vue sans demander à un réseau global de réapprendre tout le personnage. Les zones qui ne sont pas visibles dans cette vue ne sont pas touchées.\n\nLe programme déduplique aussi les exemples selon la primitive, le texel, la normale, la direction de vue et la position locale. Pour une projection issue de ComfyUI, la profondeur de la caméra est utilisée afin de vérifier qu’un texel est réellement visible avant de lui attribuer la couleur générée.\n\nIl existe également un mode « texture à plat » qui encode directement la texture d’origine dans le terme constant des mini-modèles. Dans ce cas, la couleur est reproduite sans approximation et reste identique depuis toutes les directions. Cette base peut ensuite être enrichie progressivement avec des vues dépendantes de la caméra.",
              "medias": []
            },
            {
              "title": "Rendu temps réel — Le réseau devient un shader",
              "description": "La grande différence de la V2 apparaît au moment du rendu.\nLa V1 devait envoyer tous les pixels de l’écran dans LibTorch. La V2 n’a plus besoin de faire tourner un réseau neuronal général pendant l’affichage : les coefficients sont déjà dans une texture GPU et le shader n’exécute que quelques multiplications pour le texel concerné.\n\nLe rendu devient donc extrêmement fluide.\nSa capacité ne dépend plus de la taille d’un modèle central, mais de la résolution de la texture neuronale. Chaque pixel étant indépendant, ajouter du détail à un endroit ne consomme pas de capacité dans les autres zones.\n\nLa contrepartie est la taille des textures.\nUne texture neuronale contient environ douze fois plus de données qu’une texture RGB classique. Le fichier final est donc plus lourd, mais ce coût reste prévisible et surtout il n’augmente pas le temps de calcul comme dans la V1.\n\nPour mon objectif, cet échange est beaucoup plus intéressant : je préfère un modèle plus lourd sur le disque mais capable d’être affiché en temps réel dans une scène animée.",
              "medias": [
                "assets/projects/NeuralRendering/medias/ImgKeys.png"
              ]
            },
            {
              "title": "Export GLB et intégration Unity",
              "description": "La V2 peut exporter directement un GLB neuronal.\nLe programme crée une copie du modèle original et ajoute les atlas dans une extension personnalisée nommée `PROJECTORAI_neural_texture`. Les géométries, matériaux, textures classiques et morph targets restent présents dans le fichier.\n\nJ’ai ensuite créé l’intégration Unity correspondante.\nUn importeur extrait les atlas neuronaux contenus dans le GLB, puis un composant les applique aux différentes parties du modèle. Le shader URP `ProjectorAI/Neural Rendering` relit les 36 coefficients, utilise la normale et la caméra Unity, puis reproduit le même calcul que le viewer C++.\n\nCela prouve que la technique n’est pas limitée au prototype d’entraînement.\nLe modèle peut être préparé dans l’outil, exporté, puis utilisé dans un vrai moteur de production sans LibTorch ni CUDA au moment du rendu.",
              "medias": []
            },
            {
              "title": "État actuel — Vers une intégration dans ProjectorAI",
              "description": "La V2 a résolu les deux défauts qui bloquaient la première version : la latence et la capacité du réseau partagé.\nLe rendu est maintenant temps réel et chaque texel peut apprendre indépendamment de tous les autres.\n\nIl reste encore plusieurs sujets à améliorer : réduire la taille des atlas, mieux interpoler les angles jamais vus, gérer plus proprement les coutures UV et trouver le meilleur équilibre entre la résolution, le nombre de vues et le temps d’entraînement.\n\nL’étape suivante est d’intégrer ce système dans [projet=projectorai]ProjectorAI[/projet].\nLes projecteurs du logiciel pourront alors produire les vues avec ComfyUI, entraîner directement les textures neuronales et exporter un modèle prêt à être utilisé dans Moderaworld.\n\nLa V1 reste importante parce qu’elle a validé l’idée. Mais la V2 est la première version qui me semble réellement compatible avec un anime complet.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "regain-the-world",
      "title": "Regain The World",
      "date": "2019 – 2020",
      "duration": "6 mois",
      "category": [
        "Game Development",
        "Epita"
      ],
      "icon": "assets/projects/Epita/RegainTheWorld/icon.jpg",
      "media": "assets/projects/Epita/RegainTheWorld/Image Principale.png",
      "description": "[b]Regain The World[/b] est le jeu vidéo que j'ai réalisé à EPITA durant l'année 2019-2020, avec trois autres étudiants.\nOn avait [u]six mois pour créer un jeu complet de A à Z[/u] avec Unity 3D (en C#), en parallèle de tous les cours, des TP et des partiels — autrement dit, sur notre temps libre.\nC'était intense, exigeant, parfois épuisant… mais c'est aussi l'un des projets dont je suis le plus fier.\n\nJe me suis occupé du [i]lead du projet[/i], de l'organisation, du code principal et d'une grande partie de la direction artistique.\nMême si, avec le recul, je ne trouve pas la version finale particulièrement belle, elle reste très importante à mes yeux : c'est grâce à ce projet que j'ai appris à gérer une équipe, à concrétiser une vision, et à aller au bout d'un objectif ambitieux malgré les contraintes.\n\n\nD'ailleurs, en 2023, j'ai commencé à travailler sur un remake complet du jeu, plus moderne et plus fidèle à ce que j'avais imaginé à l'époque — un moyen de redonner vie à cet univers avec tout ce que j'ai appris depuis.",
      "medias": [
        "assets/projects/Epita/RegainTheWorld/galerie/1.png",
        "assets/projects/Epita/RegainTheWorld/galerie/2.png",
        "assets/projects/Epita/RegainTheWorld/galerie/3.png",
        "assets/projects/Epita/RegainTheWorld/galerie/4.png",
        "assets/projects/Epita/RegainTheWorld/galerie/5.png",
        "assets/projects/Epita/RegainTheWorld/galerie/6.png",
        "assets/projects/Epita/RegainTheWorld/galerie/7.png",
        "assets/projects/Epita/RegainTheWorld/galerie/8.png",
        "assets/projects/Epita/RegainTheWorld/galerie/9.png",
        "assets/projects/Epita/RegainTheWorld/galerie/11.png",
        "assets/projects/Epita/RegainTheWorld/galerie/12.png",
        "assets/projects/Epita/RegainTheWorld/galerie/13.png",
        "assets/projects/Epita/RegainTheWorld/galerie/14.png",
        "assets/projects/Epita/RegainTheWorld/galerie/15.png",
        "assets/projects/Epita/RegainTheWorld/galerie/16.png",
        "assets/projects/Epita/RegainTheWorld/galerie/17.png",
        "assets/projects/Epita/RegainTheWorld/galerie/18.png",
        "assets/projects/Epita/RegainTheWorld/galerie/19.png",
        "assets/projects/Epita/RegainTheWorld/galerie/20.png",
        "assets/projects/Epita/RegainTheWorld/galerie/22.png",
        "assets/projects/Epita/RegainTheWorld/galerie/23.png",
        "assets/projects/Epita/RegainTheWorld/galerie/24.png",
        "assets/projects/Epita/RegainTheWorld/galerie/25.png",
        "assets/projects/Epita/RegainTheWorld/galerie/26.png",
        "assets/projects/Epita/RegainTheWorld/galerie/27.png",
        "assets/projects/Epita/RegainTheWorld/galerie/28.png",
        "assets/projects/Epita/RegainTheWorld/galerie/30.png",
        "assets/projects/Epita/RegainTheWorld/galerie/31.png",
        "assets/projects/Epita/RegainTheWorld/galerie/32.png",
        "assets/projects/Epita/RegainTheWorld/galerie/33.png",
        "assets/projects/Epita/RegainTheWorld/galerie/34.png",
        "assets/projects/Epita/RegainTheWorld/galerie/35.png",
        "assets/projects/Epita/RegainTheWorld/galerie/36.png",
        "assets/projects/Epita/RegainTheWorld/galerie/37.png",
        "assets/projects/Epita/RegainTheWorld/galerie/38.png",
        "assets/projects/Epita/RegainTheWorld/galerie/39.png",
        "assets/projects/Epita/RegainTheWorld/galerie/40.png",
        "assets/projects/Epita/RegainTheWorld/galerie/41.png",
        "assets/projects/Epita/RegainTheWorld/galerie/42.png",
        "assets/projects/Epita/RegainTheWorld/galerie/43.png",
        "assets/projects/Epita/RegainTheWorld/galerie/44.png",
        "assets/projects/Epita/RegainTheWorld/galerie/45.png",
        "assets/projects/Epita/RegainTheWorld/galerie/46.png",
        "assets/projects/Epita/RegainTheWorld/galerie/47.png",
        "assets/projects/Epita/RegainTheWorld/galerie/48.png",
        "assets/projects/Epita/RegainTheWorld/galerie/49.png",
        "assets/projects/Epita/RegainTheWorld/galerie/50.png",
        "assets/projects/Epita/RegainTheWorld/galerie/51.png",
        "assets/projects/Epita/RegainTheWorld/galerie/52.png",
        "assets/projects/Epita/RegainTheWorld/galerie/53.png",
        "assets/projects/Epita/RegainTheWorld/galerie/54.png",
        "assets/projects/Epita/RegainTheWorld/galerie/55.png",
        "assets/projects/Epita/RegainTheWorld/galerie/56.png",
        "assets/projects/Epita/RegainTheWorld/galerie/57.png",
        "assets/projects/Epita/RegainTheWorld/galerie/58.png",
        "assets/projects/Epita/RegainTheWorld/galerie/59.png",
        "assets/projects/Epita/RegainTheWorld/galerie/60.png",
        "assets/projects/Epita/RegainTheWorld/galerie/61.png",
        "assets/projects/Epita/RegainTheWorld/galerie/62.png",
        "assets/projects/Epita/RegainTheWorld/galerie/63.png",
        "assets/projects/Epita/RegainTheWorld/galerie/64.png",
        "assets/projects/Epita/RegainTheWorld/galerie/65.png",
        "assets/projects/Epita/RegainTheWorld/galerie/66.png",
        "assets/projects/Epita/RegainTheWorld/galerie/67.png",
        "assets/projects/Epita/RegainTheWorld/galerie/68.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Les débuts — Le prototype",
              "description": "On devait trouver un nom d'équipe. On s'est finalement réunis sous le nom Relik (pour “relique”), un mot qui collait parfaitement avec l'univers qu'on voulait construire : un monde fantastique, rempli de mystère, de magie et de ruines oubliées.\n\nL'un des plus grands défis techniques imposés par le cahier des charges était de créer un jeu multijoueur en ligne.\nPour rendre cela cohérent dans le scénario, on a imaginé une équipe de quatre aventuriers. Les quatre sont jouables, mais si un joueur manque, il est automatiquement remplacé par une IA pour garder le groupe complet. De plus, à tout moment, le joueur pouvait échanger de rôle et prendre le contrôle d'un autre membre du groupe contrôlé par l'IA, simplement en appuyant sur une touche.\n\nTrès vite, le concept s'est affiné :\nun groupe de personnages ordinaires propulsés dans une autre dimension après une expérience scientifique qui tourne mal.\nPerdus dans un monde inconnu, ils doivent retrouver plusieurs reliques pour rouvrir un portail et regagner leur monde d'origine.",
              "medias": [
                "assets/projects/Epita/RegainTheWorld/proto/1.png",
                "assets/projects/Epita/RegainTheWorld/proto/2.png",
                "assets/projects/Epita/RegainTheWorld/proto/3.png",
                "assets/projects/Epita/RegainTheWorld/proto/4.png",
                "assets/projects/Epita/RegainTheWorld/proto/5.png",
                "assets/projects/Epita/RegainTheWorld/proto/6.png",
                "assets/projects/Epita/RegainTheWorld/proto/7.png",
                "assets/projects/Epita/RegainTheWorld/proto/8.png",
                "assets/projects/Epita/RegainTheWorld/proto/9.png",
                "assets/projects/Epita/RegainTheWorld/proto/10.png",
                "assets/projects/Epita/RegainTheWorld/proto/unknown-38.png",
                "assets/projects/Epita/RegainTheWorld/proto/unknown-42.png",
                "assets/projects/Epita/RegainTheWorld/proto/unknown-37.png",
                "assets/projects/Epita/RegainTheWorld/proto/unknown-34.png",
                "assets/projects/Epita/RegainTheWorld/proto/unknown-48.png",
                "assets/projects/Epita/RegainTheWorld/proto/music spectre.mp4"
              ]
            },
            {
              "title": "La réalisation — Six mois pour créer un univers",
              "description": "Nous avons décidé de quasiment tout faire nous-mêmes : la 3D, les musiques, les cinématiques, les IA, le multijoueur…\nJ'ai pris le rôle de chef de projet, ce qui signifiait organiser le travail, répartir les tâches, gérer la cohérence du jeu et surtout garder une vision d'ensemble.\n\nNous avons travaillé sous Unity, avec une méthode basée sur le prototypage rapide : créer une version jouable le plus tôt possible, puis l'améliorer au fil du temps.\nJ'ai développé une grande partie des systèmes du jeu — le moteur multijoueur, les dialogues, le système de sauvegarde, les menus, les lumières et les cinématiques.\n\nEn six mois, nous avons construit un univers complet :\n[enum=1]• Une prison d'introduction inspirée d'Alcatraz[/enum]\n[enum=1]• Une jungle immense pleine d'énigmes[/enum]\n[enum=1]• Un temple aquatique[/enum]\n[enum=1]• Deux villes vivantes peuplées de PNJ dynamiques[/enum]\n[enum=1]• Une tour finale abritant le combat contre le boss du jeu[/enum]",
              "medias": [
                "assets/projects/Epita/RegainTheWorld/realisation/1.png",
                "assets/projects/Epita/RegainTheWorld/realisation/2.png",
                "assets/projects/Epita/RegainTheWorld/realisation/3.png",
                "assets/projects/Epita/RegainTheWorld/realisation/4.png",
                "assets/projects/Epita/RegainTheWorld/realisation/5.png",
                "assets/projects/Epita/RegainTheWorld/realisation/6.png",
                "assets/projects/Epita/RegainTheWorld/realisation/7.png",
                "assets/projects/Epita/RegainTheWorld/realisation/8.png",
                "assets/projects/Epita/RegainTheWorld/realisation/9.png",
                "assets/projects/Epita/RegainTheWorld/realisation/10.png",
                "assets/projects/Epita/RegainTheWorld/realisation/11.png",
                "assets/projects/Epita/RegainTheWorld/realisation/12.png",
                "assets/projects/Epita/RegainTheWorld/realisation/13.png",
                "assets/projects/Epita/RegainTheWorld/realisation/combat.mp4",
                "assets/projects/Epita/RegainTheWorld/realisation/city.jpg",
                "assets/projects/Epita/RegainTheWorld/realisation/unityWaterfall.gif",
                "assets/projects/Epita/RegainTheWorld/realisation/unknown-19.png",
                "assets/projects/Epita/RegainTheWorld/realisation/unknown-24.png",
                "assets/projects/Epita/RegainTheWorld/realisation/unknown-27.png",
                "assets/projects/Epita/RegainTheWorld/realisation/unknown-31.png",
                "assets/projects/Epita/RegainTheWorld/realisation/unknown-33.png"
              ]
            },
            {
              "title": "L'aboutissement — Plus qu'un jeu, une expérience humaine",
              "description": "Au bout de six mois, Regain The World était devenu un vrai jeu vidéo : jouable du début à la fin, en solo comme en multijoueur, avec une histoire complète et une ambiance marquée.\nMais au-delà du résultat, cette expérience m'a profondément appris à travailler en équipe, à gérer la pression, à communiquer efficacement, et surtout à rester motivé jusqu'au bout.\n\nIl y a eu des nuits blanches, des crashs imprévus, des moments de doute, mais aussi une immense fierté à chaque étape franchie.\nVoir le jeu fonctionner pour la première fois reste un souvenir fort : ce moment où tout le travail prend enfin vie à l'écran.",
              "medias": [
                "assets/projects/Epita/RegainTheWorld/aboutissement/Image Boite.png",
                "assets/projects/Epita/RegainTheWorld/aboutissement/Jaquette.png",
                "assets/projects/Epita/RegainTheWorld/aboutissement/1.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/2.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/3.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/4.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/5.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/6.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/7.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/8.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/9.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/10.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/11.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/12.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/13.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/14.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/15.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/16.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/17.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/18.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/19.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/20.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/21.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/22.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/23.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/24.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/25.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/26.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/27.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/28.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/29.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/30.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/31.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/32.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/33.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/34.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/35.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/36.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/37.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/38.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/39.PNG",
                "assets/projects/Epita/RegainTheWorld/aboutissement/Screenshot_20220916-204033_Gallery.jpg",
                "assets/projects/Epita/RegainTheWorld/aboutissement/Screenshot_20220916-204213_Gallery.jpg"
              ]
            },
            {
              "title": "Les présentations — EPITA et les portes ouvertes",
              "description": "Pendant ces six mois, le projet a été rythmé par plusieurs grandes étapes :\n[enum=1]• la rédaction du cahier des charges,[/enum]\n[enum=1]• trois soutenances officielles espacées tout au long du développement,[/enum]\n[enum=1]• et la remise d'un coffret complet contenant :[/enum]\n[enum=2]• le rapport final,[/enum]\n[enum=2]• un livret d'utilisation,[/enum]\n[enum=2]• et une clé USB (+CD ROM) du jeu.[/enum]\n\nÀ la fin du projet, l'administration d'EPITA nous a également demandé de présenter notre jeu lors des journées portes ouvertes de l'école, et faire découvrir notre travail à des familles, à des lycéens curieux, et voir leurs réactions en direct.\nPour l'occasion, nous avons aussi réalisé une vidéo explicative ainsi qu'un trailer pour présenter notre univers et notre processus de création.",
              "medias": [
                "assets/projects/Epita/RegainTheWorld/presentations/Trailer.mp4",
                "assets/projects/Epita/RegainTheWorld/presentations/Presentation.mp4"
              ]
            },
            {
              "title": "Le remake — 2023",
              "description": "En 2023, j'ai voulu redonner vie à Regain The World.\nMon objectif était de créer une version plus belle, plus fluide, avec des mécaniques modernisées et surtout sans les bugs de la version originale.\nCe remake m'a permis de replonger dans cet univers avec plus de maturité et d'expérience, en repensant chaque détail.\n\nMalheureusement, le projet est resté au stade de prototype.\nLe développement s'est arrêté, principalement à cause du level design, qui demande beaucoup de temps et de patience — et c'est un domaine dans lequel je sais que je dois encore progresser.",
              "medias": [
                "assets/projects/Epita/RegainTheWorld/remake/IMG_20220718_022053_255.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/IMG_20220718_022053_393.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/20220224_210537.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/20230917_140325.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/demo.gif",
                "assets/projects/Epita/RegainTheWorld/remake/Prison Ext_Paint.png",
                "assets/projects/Epita/RegainTheWorld/remake/unknown.png",
                "assets/projects/Epita/RegainTheWorld/remake/unknown-2.png",
                "assets/projects/Epita/RegainTheWorld/remake/Projet S2 remake.mp4",
                "assets/projects/Epita/RegainTheWorld/remake/Screenshot_20230926_164456_Gallery.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/Screenshot_20230926_164518_Gallery.jpg",
                "assets/projects/Epita/RegainTheWorld/remake/Vidéo Regain The World Remake IA.mp4"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "particule-engine",
      "title": "Particule Engine",
      "date": "Juillet 2020 – aujourd’hui",
      "duration": "5 ans et 11 mois",
      "category": [
        "Game Development",
        "Tools"
      ],
      "icon": "assets/projects/Particule/icon.jpg",
      "description": "[b]Particule Engine[/b] (et son cœur, [i]Particule SDK[/i]) est un moteur de jeu multi-distribution que je développe depuis 2020, inspiré de Unity, mais conçu pour être plus léger, ouvert et entièrement portable.\nMon objectif : créer un moteur capable de tourner sur presque n'importe quelle machine : PC, console, ou même calculatrice Casio, à partir d'[u]un seul code source[/u].\n\nL'idée est née de ma frustration face aux limites des outils existants : je voulais pouvoir écrire un code unique, et le déployer partout, sans dépendre d'un environnement propriétaire.\n\nParticule, c'est à la fois un éditeur, un moteur, et un SDK en C++, pensés pour fonctionner ensemble, de manière modulaire et adaptable à chaque plateforme.\n\n[url=https://github.com/leofarhi/ParticuleSDK]Lien du repo Github[/url]",
      "media": "assets/projects/Particule/Image Principale.png",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Le contexte",
              "description": "En développant des jeux sur PC avec Unity et sur calculatrices Casio, j'ai réalisé qu'il manquait un outil unifié.\nJe voulais un flux de travail unique, où l'on code une fois et où l'on exporte sur n'importe quelle plateforme, sans devoir tout réécrire.\nC'est de là qu'est né Particule SDK : reprendre les forces de Unity et les adapter à un environnement beaucoup plus flexible, à travers un éditeur visuel, un SDK léger et une architecture multi-distribution en C++.",
              "medias": [
                "assets/projects/Particule/contexe/Screenshot_20230926_163859_Gallery.jpg",
                "assets/projects/Particule/contexe/Screenshot_20230926_163931_Gallery.jpg",
                "assets/projects/Particule/contexe/Screenshot_20230926_163908_Gallery.jpg",
                "assets/projects/Particule/contexe/20200813_190225.jpg",
                "assets/projects/Particule/contexe/rtj5.jpg",
                "assets/projects/Particule/contexe/20211127_164523.jpg",
                "assets/projects/Particule/contexe/20211127_151754.jpg"
              ]
            },
            {
              "title": "Les débuts — de Unity à mon propre moteur",
              "description": "Unity m'a beaucoup appris. C'est un environnement efficace, mais quand il s'agit d'exporter sur plusieurs plateformes, les limites se font vite sentir : dépendances propriétaires, processus lourds, ajustements infinis.\nJ'ai voulu retrouver cette efficacité, mais dans un cadre que je maîtrise entièrement.\n\nL'idée de départ était claire : créer un éditeur de type Unity, avec import d'assets, gestion de scènes et logique entité-composant, mais qui puisse générer des versions jouables sur différentes machines sans repartir de zéro.\nDans cette phase j'ai aussi tenté une interface plus simple : un “Visual Scratch”, pour pouvoir créer des jeux sans coder intensivement",
              "medias": [
                "assets/projects/Particule/debuts/7yip.png",
                "assets/projects/Particule/debuts/casio.PNG",
                "assets/projects/Particule/debuts/t736.png",
                "assets/projects/Particule/debuts/visual scratch.PNG",
                "assets/projects/Particule/debuts/hid4.png",
                "assets/projects/Particule/debuts/200512030856819595.png",
                "assets/projects/Particule/debuts/b99i.png",
                "assets/projects/Particule/debuts/shcz.png",
                "assets/projects/Particule/debuts/u0ap.png",
                "assets/projects/Particule/debuts/unz6.png"
              ]
            },
            {
              "title": "Le fonctionnement — architecture et conception",
              "description": "L'architecture de Particule SDK repose sur quelques fondations solides :\n\n[enum=1]• Un éditeur PC (inspiré de Unity) pour importer images, sons, et configurer les scènes.[/enum]\n\n[enum=1]• Un SDK en C++, compilé pour chaque plateforme cible : calculatrice Casio, Nintendo DS, 3DS, Wii, Switch, PSP ou PC.[/enum]\n\n[enum=1]• Une couche d'abstraction pour gérer les différences entre plateformes : rendu, entrées, mémoire, etc.[/enum]\n\n[enum=1]• Un seul code logique, partagé entre toutes les cibles.[/enum]\n\nÀ l'origine, j'avais commencé en Python/Tkinter, mais j'ai vite migré vers le C++ : plus rapide, plus précis, et indispensable pour gérer les contraintes matérielles.\nCette approche m'a permis de tester plusieurs plateformes et de prouver que le concept fonctionne, même si tout n'est pas encore finalisé.",
              "medias": [
                "assets/projects/Particule/fonctionnement/20200813_190711.jpg",
                "assets/projects/Particule/fonctionnement/c728.png",
                "assets/projects/Particule/fonctionnement/nei5.png",
                "assets/projects/Particule/fonctionnement/u7bo.png",
                "assets/projects/Particule/fonctionnement/ftkq.png",
                "assets/projects/Particule/fonctionnement/particule.PNG",
                "assets/projects/Particule/fonctionnement/ytyyrty.png",
                "assets/projects/Particule/fonctionnement/izkd.png",
                "assets/projects/Particule/fonctionnement/particule1.PNG",
                "assets/projects/Particule/fonctionnement/TransformTuto.gif",
                "assets/projects/Particule/fonctionnement/r37s.png"
              ]
            },
            {
              "title": "Les tentatives, les échecs et les apprentissages",
              "description": "Le chemin a été tout sauf linéaire.\nCertaines idées ont échoué, mais chacune m'a appris quelque chose :\n\n[enum=1]• Le premier prototype Python/Tkinter fonctionnait, mais n'était pas viable pour la performance ni la portabilité.[/enum]\n\n[enum=1]• L'idée du Visual Scratch reste dans mes carnets ; elle reviendra plus tard sous une forme plus solide.[/enum]\n\n[enum=1]• Plusieurs ports, notamment sur DS, 3DS et Wii, ont été testés puis mis en pause. Ces essais m'ont beaucoup appris sur les contraintes de chaque machine : mémoire, affichage, gestion d'entrée, etc.[/enum]\n\nToutes ces étapes ont façonné Particule. Ce n'est pas un projet figé : c'est un laboratoire d'idées en constante évolution.",
              "medias": [
                "assets/projects/Particule/tentatives/Particule 2.0 Beta.mp4"
              ]
            },
            {
              "title": "L'état actuel et les perspectives",
              "description": "Aujourd'hui, Particule SDK est en version prototype.\nL'éditeur est en cours de réécriture complète en C++, le SDK compile déjà pour plusieurs plateformes, et certains jeux fonctionnent dessus.\n\nMais il reste encore du travail : finaliser les ports, renforcer la stabilité, enrichir l'éditeur, et surtout rendre l'interface plus intuitive.\nL'objectif ne change pas : proposer un moteur-éditeur unique, où l'on code une fois et déploie partout, que ce soit sur une calculatrice, une console, ou un PC, à la manière d'un Unity… mais libre, minimaliste et adapté à mes besoins.",
              "medias": [
                "assets/projects/Particule/etat_actuel/cap.png",
                "assets/projects/Particule/etat_actuel/sdegfsdfd.png",
                "assets/projects/Particule/etat_actuel/t9f1.png",
                "assets/projects/Particule/etat_actuel/vsx8.png"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "underworld",
      "title": "Underworld",
      "date": "2022 – 2023",
      "duration": "6 mois",
      "category": [
        "AI",
        "Epita"
      ],
      "icon": "assets/projects/Epita/Underworld/icon.jpg",
      "description": "[b]Underworld[/b] est un projet que j’ai réalisé à EPITA durant l’année 2022-2023, avec trois camarades de promotion.\nNous avions six mois pour concevoir un programme complet autour d’un concept libre. J’ai pris le rôle de chef de projet, en charge de l’architecture, du code principal, de l’intelligence artificielle et du moteur d’affichage.\n\nNotre idée était ambitieuse : créer un monde virtuel 2D vivant, où des [u]intelligences artificielles autonomes[/u] évoluent, s’adaptent et apprennent à survivre.\nUn univers dans lequel les IA ne suivent pas un script, mais émergent de règles biologiques inspirées de la [i]sélection naturelle[/i].\nEn somme, un mélange entre un simulateur de vie et une expérience d’intelligence artificielle évolutive.\n\n[url=https://anthav2002.wixsite.com/underworld]Site web du projet[/url]",
      "media": "assets/projects/Epita/Underworld/Image Principale.png",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Le concept — un “jeu de la vie” moderne",
              "description": "L’idée de base vient du célèbre “Game of Life” de John Conway : un système simple de cellules qui vivent ou meurent selon des règles fixes.\nMais nous voulions aller beaucoup plus loin.\nDans Underworld, chaque entité — qu’elle soit IA, ressource ou objet — fait partie d’un écosystème complexe. Les IA y apprennent à manger, explorer, communiquer, combattre, se reproduire, et même coopérer ou rivaliser.\n\nPour cela, nous avons utilisé un réseau de neurones génétiques, où chaque IA possède son propre “cerveau” capable de muter et de se réadapter au fil des générations.\nNotre but : observer si une forme de comportement collectif, voire d’intelligence émergente, pouvait naître naturellement.",
              "medias": [
                "assets/projects/Epita/Underworld/concept/1.png",
                "assets/projects/Epita/Underworld/concept/2.png",
                "assets/projects/Epita/Underworld/concept/3.png",
                "assets/projects/Epita/Underworld/concept/4.png",
                "assets/projects/Epita/Underworld/concept/5.png"
              ]
            },
            {
              "title": "Les débuts — poser les fondations d’un monde",
              "description": "Dès le départ, nous savions que ce projet demanderait une base technique solide.\nNous avons donc commencé par développer l’Underworld lui-même : un moteur 2D en C, avec une architecture découpée en chunks (comme Minecraft) pour optimiser le rendu et la mémoire.\nChaque bloc du monde est stocké, sauvegardé, chargé et mis à jour en temps réel.\nJ’ai également conçu un moteur d’interface graphique complet sous SDL2. Boutons, curseurs, panneaux, zones de texte… tout a été codé à la main, depuis zéro.\nPour les graphismes, nous avons utilisé les tilesets de RPG Maker.\nPendant qu’Amanda s’occupait du design sous Figma, Bob construisait la structure du monde et Antoine développait le site web de présentation, j’ai posé les bases du Makefile multiplateforme et du système d’IA.",
              "medias": [
                "assets/projects/Epita/Underworld/debuts/35.png",
                "assets/projects/Epita/Underworld/debuts/36.png",
                "assets/projects/Epita/Underworld/debuts/15.png",
                "assets/projects/Epita/Underworld/debuts/16.png",
                "assets/projects/Epita/Underworld/debuts/18.png",
                "assets/projects/Epita/Underworld/debuts/22.png",
                "assets/projects/Epita/Underworld/debuts/24.png"
              ]
            },
            {
              "title": "La réalisation — faire vivre l’Underworld",
              "description": "Une fois les fondations en place, nous avons attaqué le cœur du projet : donner vie à l’Underworld.\nLes IA ont été conçues comme de véritables organismes : elles ont une faim, une espérance de vie, un sexe, et peuvent apprendre par génération successive.\nLeur comportement est régi par des réseaux de neurones entraînés dans des salles d’entraînement dédiées — 46 au total — chacune simulant une compétence : se déplacer, reconnaître la nourriture, éviter la lave, communiquer, attaquer, coopérer ou se reproduire.\n\nUn système nommé \"Cardinal\" agit comme une \"divinité\" virtuelle.\nelld observe, juge, et équilibre le monde : elle réanime les IA prometteuses, supprime celles qui dérivent, et attribue un “karma” selon leurs actions.\nC’est un peu un modérateur invisible du monde, garant de son harmonie.\n\nCôté technique, nous avons intégré des systèmes de génération procédurale via bruits de Perlin et Simplex, et testé brièvement l’algorithme Wave Function Collapse pour la création de cartes.",
              "medias": [
                "assets/projects/Epita/Underworld/realisation/19.png",
                "assets/projects/Epita/Underworld/realisation/20.png",
                "assets/projects/Epita/Underworld/realisation/38.png",
                "assets/projects/Epita/Underworld/realisation/8.png",
                "assets/projects/Epita/Underworld/realisation/11.png",
                "assets/projects/Epita/Underworld/realisation/26.png",
                "assets/projects/Epita/Underworld/realisation/41.png",
                "assets/projects/Epita/Underworld/realisation/14.png",
                "assets/projects/Epita/Underworld/realisation/28.png",
                "assets/projects/Epita/Underworld/realisation/21.png",
                "assets/projects/Epita/Underworld/realisation/23.png"
              ]
            },
            {
              "title": "L’aboutissement — évaluation du comportement des IA",
              "description": "À la fin du projet, nous avons pu observer des comportements cohérents démontrant que les IA avaient effectivement appris à s’adapter à leur environnement.\nGrâce aux 46 salles d’entraînement, chaque génération présentait des améliorations progressives dans la réussite des objectifs fixés : navigation, gestion de la nourriture, coopération, évitement des dangers et reconnaissance des alliés.\n\nL’apprentissage génétique s’est révélé fonctionnel :\n[enum=1]• Les IA fusionnaient correctement leurs réseaux de neurones parentaux, produisant des générations plus performantes après plusieurs cycles.[/enum]\n\n[enum=1]• Le taux de réussite moyen dans les salles d’entraînement augmentait au fil du temps, signe d’une adaptation mesurable.[/enum]\n\n[enum=1]• Certaines IA développaient des comportements collectifs simples, comme suivre un individu ou partager une ressource, sans qu’aucune règle explicite ne l’impose.[/enum]\n\nCes résultats ont confirmé que le modèle d’évolution que nous avions imaginé fonctionnait réellement.\nL’apprentissage restait évidemment limité : les IA n’élaboraient pas encore de vraies stratégies, mais elles savaient déjà s’adapter à leur environnement, réagir à de nouvelles situations et affiner leurs actions au fil des générations.\n\nCertaines finissaient même par adopter des comportements inattendus, comme éviter les zones dangereuses, suivre d’autres IA ou gérer leurs priorités de manière plus efficace que leurs ancêtres.\n\nEn résumé, malgré les contraintes techniques et le temps de calcul réduit, on a pu constater que notre système d’IA génétique apprenait vraiment.\nPas de manière “intelligente” au sens humain, mais suffisamment pour montrer qu’une forme d’adaptation émergente était bien possible.",
              "medias": [
                "assets/projects/Epita/Underworld/aboutissement/7.png",
                "assets/projects/Epita/Underworld/aboutissement/37.png",
                "assets/projects/Epita/Underworld/aboutissement/9.png",
                "assets/projects/Epita/Underworld/aboutissement/17.png",
                "assets/projects/Epita/Underworld/aboutissement/34.png",
                "assets/projects/Epita/Underworld/aboutissement/40.png",
                "assets/projects/Epita/Underworld/aboutissement/39.png",
                "assets/projects/Epita/Underworld/aboutissement/25.png",
                "assets/projects/Epita/Underworld/aboutissement/12.png",
                "assets/projects/Epita/Underworld/aboutissement/13.png",
                "assets/projects/Epita/Underworld/aboutissement/10.png",
                "assets/projects/Epita/Underworld/aboutissement/27.png",
                "assets/projects/Epita/Underworld/aboutissement/29.png",
                "assets/projects/Epita/Underworld/aboutissement/30.png",
                "assets/projects/Epita/Underworld/aboutissement/31.png",
                "assets/projects/Epita/Underworld/aboutissement/32.png",
                "assets/projects/Epita/Underworld/aboutissement/33.png"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "thermorph",
      "title": "Thermorph",
      "date": "Novembre 2023",
      "duration": "1 mois",
      "category": [
        "Game Development"
      ],
      "icon": "assets/projects/Thermorph/icon.jpg",
      "description": "[b]Thermorph[/b] est un petit jeu que j’ai réalisé lors de la [url=https://itch.io/jam/game-off-2023]Game Off 2023[/url], une game jam internationale organisée sur itch.io.\nLe thème de cette édition était [i]« Scale »[/i], un mot à plusieurs sens : échelle, taille, mesure, ou encore transformation.\nNous avions [u]un mois pour créer un jeu complet[/u] à partir de ce concept, en équipe et entièrement à distance.\n\nJ’ai formé un groupe sur Discord, et très vite, nous étions quatre :\nJuka à la musique et au sound design, Omer Yuncu pour les environnements 3D, Izivad pour les illustrations 2D, et X-90 pour la modélisation 3D.\nDe mon côté, j’ai assuré la programmation, le level design, et une bonne partie de l’intégration technique.\nMême si le rôle affiché sur la page officielle est “Dev”, j’ai aussi coordonné l’équipe et relié toutes les pièces du projet ensemble.\n\n[url=https://farhi.itch.io/thermorph]Lien du jeu[/url]",
      "media": "assets/projects/Thermorph/Image Principale.png",
      "medias": [
        "assets/projects/Thermorph/imgs/0_Ltpt.png",
        "assets/projects/Thermorph/imgs/0BWVhe.png",
        "assets/projects/Thermorph/imgs/2KtlsM.png",
        "assets/projects/Thermorph/imgs/btlhk1.png",
        "assets/projects/Thermorph/imgs/CfnHUT.png",
        "assets/projects/Thermorph/imgs/NdmkOM.png",
        "assets/projects/Thermorph/imgs/Oa0UAl.png",
        "assets/projects/Thermorph/imgs/rJ3pPL.png",
        "assets/projects/Thermorph/imgs/TVPX5i.png",
        "assets/projects/Thermorph/imgs/vBlsmv.png",
        "assets/projects/Thermorph/imgs/VS9zPS.png",
        "assets/projects/Thermorph/imgs/y_mjzS.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Le concept — jouer avec la chaleur et le froid",
              "description": "Dans Thermorph, on incarne un petit robot issu d’un centre de recherche, réveillé plusieurs années après une expérience scientifique ratée.\nL’environnement est désormais instable, les lieux abandonnés, et d’autres robots — autrefois alliés — sont devenus hostiles, chacun défendant son territoire.\n\nLe joueur explore un monde en ruine où la température devient une arme.\nLe personnage peut tirer des boules de feu ou de glace, alterner librement entre les deux, et même charger une attaque spéciale en maintenant le tir.\nEn modulant la température de ses projectiles, le joueur peut influencer l’environnement :\n\n[enum=1]• Les boules de glace figent l’eau et créent des plateformes temporaires sur la lave.[/enum]\n[enum=1]• Les boules de feu font fondre la glace et débloquent de nouveaux passages.[/enum]\n\nMais la température n’affecte pas que le décor : elle agit aussi sur le corps du robot lui-même.\n\n[enum=1]• Sous le froid, il rétrécit, ce qui lui permet de passer dans des espaces étroits.[/enum]\n[enum=1]• Sous la chaleur, il fond partiellement, devenant capable de traverser des grilles perforées.[/enum]\n\nLes ennemis sont eux aussi sensibles à la température.\nPour les vaincre, il faut les surchauffer ou les glacer suffisamment longtemps — mais attention : s’ils refroidissent ou se réchauffent trop vite, ils reprennent vie.",
              "medias": []
            },
            {
              "title": "Le développement — un mois de création intensive",
              "description": "La game jam se déroulait entièrement en ligne, et l’organisation n’a pas toujours été simple.\nAu début, les idées partaient dans tous les sens : chacun imaginait un jeu différent.\nOn a donc pris le temps de voter, de trancher, et d’établir une base claire pour ne pas se disperser.\n\nUne fois le concept validé, j’ai défini la structure du jeu et attribué les tâches de production.\nPendant que les artistes travaillaient sur les modèles et les textures, j’ai conçu la gestion des températures, et l’ensemble des mécaniques physiques (fonte, rétrécissement, plateformes de glace, projectiles).\n\nNous voulions un rendu rétro, à mi-chemin entre 3D et pixel art.\nPour ça, j’ai ajouté un shader de pixelisation, donnant cet effet de “jeu PS1 modernisé” qui colle bien à l’ambiance.\n\nLe temps était court, alors nous avons concentré nos efforts sur un seul niveau : une démo jouable qui présente toutes les mécaniques principales.\nCe niveau sert à montrer comment le joueur peut combiner les interactions — température, taille, environnement — pour progresser.\nMême si le jeu n’est pas complet, tout le cœur du gameplay est présent et fonctionnel.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "frontiers-of-legends",
      "title": "Frontiers Of Legends",
      "date": "Décembre 2023 – aujourd’hui",
      "duration": "2 ans et 6 mois",
      "category": [
        "Game Development"
      ],
      "icon": "assets/projects/FrontiersOfLegends/icon.jpg",
      "description": "[b]Frontiers of Legends[/b] est un prototype que j’ai commencé à développer pour des raisons avant tout personnelles et techniques.\nL’idée était simple : comprendre comment fonctionne un [u]monde ouvert à grande échelle[/u], et voir jusqu’où je pouvais aller en le reproduisant dans Unity, un moteur qui n’est pas conçu nativement pour ce type de projet.\n\nEn tant que grand fan de [i]The Legend of Zelda: Breath of the Wild[/i], j’ai voulu partir d’un terrain familier.\nMon objectif : analyser, extraire et comprendre la structure du monde de Zelda pour recréer un système équivalent dans Unity.\n\nFrontiers of Legends reste à ce jour un prototype, sans ambition commerciale immédiate. Si un jour je décide d’en faire un projet commercial, la carte sera évidemment entièrement refaite par mes soins, pour des raisons de droit d’auteur et d’originalité.\nLe projet m’a surtout servi de terrain d’expérimentation pour approfondir mes connaissances.",
      "media": "assets/projects/FrontiersOfLegends/Image Principale.png",
      "medias": [],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Exploration technique — comprendre le monde de Zelda",
              "description": "Pour commencer, j’ai dû ripper les données du jeu afin d’en étudier le fonctionnement interne.\nL’objectif n’était pas de copier le contenu, mais d’analyser comment Nintendo gère un monde aussi vaste avec des performances aussi stables.\n\nEn inspectant les fichiers, j’ai découvert que le moteur de Zelda utilise plusieurs versions du même chunk, chacune à une résolution différente.\nCe système permet au jeu de charger dynamiquement le niveau de détail du terrain en fonction de la distance, tout en gardant une mémoire maîtrisée.\n\nAprès plusieurs essais et beaucoup de débogage, j’ai réussi à extraire la heightmap complète (la carte des altitudes) avec la plus haute résolution disponible.\nCette base m’a permis de reconstruire un terrain 3D fidèle, entièrement dans Unity.",
              "medias": [
                "assets/projects/FrontiersOfLegends/technique/hghtmap_4.png"
              ]
            },
            {
              "title": "Construction du moteur — un Open World sur Unity",
              "description": "Une fois la heightmap récupérée, j’ai développé mon propre système de gestion de chunks.\nUnity n’étant pas conçu pour du streaming massif de terrain, j’ai dû contourner ses limites et créer un système de chargement dynamique qui divise la carte en zones indépendantes.\nCes zones se chargent et se déchargent automatiquement selon la position du joueur, sans coupure ni chute de performances perceptible.\n\nJ’ai ensuite appliqué les textures de manière procédurale grâce à Gaia, en combinant altitude, pente et biomes pour obtenir un rendu naturel.\nCela m’a permis d’obtenir un terrain crédible, sans avoir à peindre manuellement chaque surface.",
              "medias": [
                "assets/projects/FrontiersOfLegends/moteur/Editor-5.gif",
                "assets/projects/FrontiersOfLegends/moteur/FrontiersOfLegends Test Chunk.mp4",
                "assets/projects/FrontiersOfLegends/moteur/Capture_decran_2024-03-30_163939.png",
                "assets/projects/FrontiersOfLegends/moteur/Capture_decran_2024-03-30_163948.png",
                "assets/projects/FrontiersOfLegends/moteur/Capture_decran_2024-03-30_164013.png",
                "assets/projects/FrontiersOfLegends/moteur/image.png",
                "assets/projects/FrontiersOfLegends/moteur/image-2.png",
                "assets/projects/FrontiersOfLegends/moteur/image-3-1.png",
                "assets/projects/FrontiersOfLegends/moteur/image-7.png",
                "assets/projects/FrontiersOfLegends/moteur/image-9.png",
                "assets/projects/FrontiersOfLegends/moteur/image-15.png",
                "assets/projects/FrontiersOfLegends/moteur/iuisugusigu.png",
                "assets/projects/FrontiersOfLegends/moteur/unity gif2.gif"
              ]
            },
            {
              "title": "Systèmes additionnels",
              "description": "Au-delà du terrain, j’ai voulu rendre le projet vivant et interactif.\nJ’ai ajouté un système multijoueur basé sur Steam, permettant à plusieurs joueurs de se connecter sur une même carte et d’explorer ensemble le monde en temps réel.\n\nJ’ai également conçu une API externe, capable de communiquer avec le jeu depuis Python ou Discord.\nCette interface permet de récupérer ou d’envoyer des données en direct — par exemple, suivre les positions des joueurs sur un serveur, afficher des informations en temps réel, ou même interagir avec le jeu depuis un bot Discord.\n\nUne autre fonctionnalité que j’ai ajoutée concerne la personnalisation du joueur.\nLe jeu permet d’importer son propre avatar 3D créé avec Vroid Studio, un logiciel permettant de générer facilement des modèles au format .vrm.\nUne fois le fichier importé, le moteur extrait automatiquement le modèle du joueur et supprime les vêtements par défaut, pour que le joueur puisse changer de vêtement en jeu.",
              "medias": [
                "assets/projects/FrontiersOfLegends/systemes/3.png",
                "assets/projects/FrontiersOfLegends/systemes/2.png",
                "assets/projects/FrontiersOfLegends/systemes/yghftytgghd.png",
                "assets/projects/FrontiersOfLegends/systemes/Untitled-3.mp4",
                "assets/projects/FrontiersOfLegends/systemes/Untitled-2.mp4",
                "assets/projects/FrontiersOfLegends/systemes/Untitled.mp4",
                "assets/projects/FrontiersOfLegends/systemes/1.png"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "3d-engines",
      "title": "3D Engines",
      "date": "Juillet 2023 – aujourd’hui",
      "duration": "2 ans et 11 mois",
      "category": [
        "Game Development"
      ],
      "icon": "assets/projects/3d-engines/icon.jpg",
      "description": "[b]3D Engines[/b] regroupe l’ensemble de mes travaux, prototypes et expérimentations autour du rendu 3D — depuis mes premières tentatives naïves jusqu’à mes moteurs les plus aboutis.\nCe n’est pas un “projet” unique, mais plutôt un chemin technique, une suite d’essais, de réécritures et d’optimisations qui m’ont permis de comprendre en profondeur [u]comment fonctionne un moteur de rendu[/u], et surtout comment en construire un à partir de zéro.\n\nAu fil des années, j’ai créé, cassé et refait plusieurs moteurs : fausse et vrai 3D, 2.5D, rendu CPU triangle par triangle, texturing, gestion de la lumière, matrices, fixed-point, approximations mathématiques…\nChaque version a servi à en alimenter une autre, jusqu’à aboutir à des projets concrets.\n\nAujourd’hui, 3D Engines représente tout ce que j’ai appris sur la 3D [i]“low-level”[/i], sur la manière de rendre un moteur plus propre, plus rapide, plus précis, malgré les limites matérielles.\nC’est un domaine que je continue d’explorer, et qui influence directement la manière dont je conçois mes scripts actuels.",
      "media": "assets/projects/3d-engines/Video Principale.mp4",
      "medias": [
        "assets/projects/3d-engines/medias/20250324_150622.jpg",
        "assets/projects/3d-engines/medias/6wf4.png",
        "assets/projects/3d-engines/medias/fgfgf.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Origine de ma passion pour la 3D",
              "description": "J’ai toujours été fasciné par les moteurs 3D.\nQuand je jouais aux jeux vidéo, enfant, je passais autant de temps à m’amuser qu’à me demander comment tout cela fonctionnait derrière l’écran.\nDès mes premiers pas sur Scratch, j’essayais déjà de reproduire de la 3D… avec des résultats souvent catastrophiques, mais qui m’ont donné envie d’aller plus loin.\n\nEn avançant dans la programmation, j’ai tenté plusieurs approches pour comprendre la 3D “à ma façon” :\n\nAu fil du temps, j’ai exploré plusieurs approches : d’abord une fausse 3D empilée (de Scratch à Basic Casio, puis Python), basée sur le principe de décaler et superposer des sprites pour donner une illusion de volume — une technique que j’avais illustrée en tentant de reproduire le style Paper Mario ; ensuite mes premières tentatives en 2.5D, où je transformais des quads pour simuler une perspective légère ; et enfin, après de nombreuses réécritures, mes premiers essais de vraie 3D, avec projection en perspective et rendu polygonal.",
              "medias": [
                "assets/projects/3d-engines/medias/3D casio.gif",
                "assets/projects/3d-engines/medias/Test 3D (ParticuleEngine).mp4"
              ]
            },
            {
              "title": "Pourquoi travailler sur calculatrice ?",
              "description": "Une question revient souvent : pourquoi développer sur une Casio Graph 90+E, une machine au processeur minuscule et sans accélération graphique ?\n\nLa réponse est simple : la contrainte forme le développeur.\n\nLa Casio n’a ni GPU, ni FPU, très peu de mémoire… et pourtant, elle oblige à :\n\n[enum=1]• optimiser chaque instruction,[/enum]\n\n[enum=1]• écrire du code clair et compact,[/enum]\n\n[enum=1]• remplacer les flottants par du fixed point,[/enum]\n\n[enum=1]• réécrire soi-même des opérations comme sin, cos, tan ou atan2,[/enum]\n\n[enum=1]• imaginer des alternatives aux fonctions trop lourdes,[/enum]\n\n[enum=1]• comprendre les vraies limites d’un moteur 3D sans “tricher”.[/enum]\n\nC’est littéralement le terrain de jeu idéal si on veut progresser en optimisation, en maths appliquées, et en architecture bas niveau.\n\nAvec ces contraintes, j’ai appris énormément :\nje suis passé de petits hacks visuels à la construction d’un pipeline 3D complet, allant du vertex shader CPU au rasterizer pixel-par-pixel.",
              "medias": []
            },
            {
              "title": "Mes différentes tentatives — et ce qu’elles m’ont appris",
              "description": "Je ne compte plus le nombre de fois où j’ai recommencé mon moteur 3D entièrement.\nÀ chaque réécriture, je testais un nouvel angle :\n\n[enum=1]• utilisation plus poussée du fixed point,[/enum]\n\n[enum=1]• rasterisation plus rapide,[/enum]\n\n[enum=1]• simplification des matrices,[/enum]\n\n[enum=1]• affichage triangle par triangle vs quad par quad,[/enum]\n\n[enum=1]• backface culling,[/enum]\n\n[enum=1]• clipping plus intelligent,[/enum]\n\n[enum=1]• projection plus précise,[/enum]\n\n[enum=1]• batching des triangles,[/enum]\n\n[enum=1]• gestion mémoire plus stricte,[/enum]\n\n[enum=1]• pipelines spécialisés selon le type d’objet.[/enum]\n\nLa plupart de ces tentatives n’ont jamais été “finies”, mais chacune m’a fait progresser.\nPlus j’avançais, plus je me suis retrouvé à réutiliser les techniques des anciens moteurs 3D des années 90. Par exemple, pour gagner en vitesse, j’ai implémenté une approximation ultra-rapide d’atan2 inspirée directement du code de Quake III, ainsi qu’un fast inverse square root allégé pour optimiser certains calculs vectoriels. Ces méthodes, combinées aux lookup tables et au fixed-point, m’ont permis de réduire drastiquement le coût des opérations trigonometriques et de projection, rendant le rendu 3D viable même sur une calculatrice.",
              "medias": []
            },
            {
              "title": "Paper Mario Mansion — ma première “fausse 3D”",
              "description": "Avant de travailler sur mes moteurs sur calculatrice, j’ai eu une première vraie expérience de pseudo-3D avec mon projet d’ISN au lycée : Paper Mario Mansion.\nOn l’a développé en Python avec Pygame, en binôme, et j’y ai créé mon propre moteur de jeu qui gérait l’affichage, les entrées clavier/souris, les menus, les cinématiques, l’inventaire, la sauvegarde, le texte multilingue… et surtout un système 3D “illusion”.\n\nComme Pygame n’a pas de 3D native, j’ai mis en place un rendu basé sur la superposition d’images 2D :\nles décors et les entités étaient affichés en plusieurs “couches” avec des tailles et positions calculées en fonction de la caméra, ce qui donnait cet effet Paper Mario en carton.\nDerrière, il y avait quand même une vraie gestion de collisions sur trois axes (X, Y, Z), de gravité, d’entités scriptées, d’anti-ram (déchargement des éléments hors écran) et même un mode créatif pour éditer les niveaux.\n\nCe projet n’était pas un moteur 3D au sens strict, mais c’est la première fois où j’ai vraiment essayé de penser un monde en volume.\nC’est clairement l’ancêtre de mes moteurs 2.5D et 3D actuels.",
              "medias": [
                "assets/projects/3d-engines/medias/ghghgh.png",
                "assets/projects/3d-engines/medias/unnamed.png"
              ]
            },
            {
              "title": "Moteurs 2.5D",
              "description": "Super Mario 3D a été mon premier moteur réellement utilisable.\nL’idée était de créer une fausse 3D convaincante tout en restant extrêmement léger, grâce à l’utilisation massive du fixed-point (aucun float) et une projection simplifiée donnant l’illusion de profondeur, ce moteur m’a permis d’établir les bases.\n\nPour TOTN v1, je suis parti exactement de cette base 2.5D.\nLa différence principale est que j’ai étendu le moteur, ajouté plus de systèmes et introduit davantage de complexité :\n\n[enum=1]• une caméra plus avancée,[/enum]\n\n[enum=1]• de nouvelles mécaniques d’interaction,[/enum]\n\n[enum=1]• un inventaire,[/enum]\n\n[enum=1]• des animations,[/enum]\n\n[enum=1]• un début de gestion de lumière “fake”,[/enum]\n\n[enum=1]• un meilleur système d’entités,[/enum]\n\n[enum=1]• un monde plus ouvert.[/enum]\n\nMais même si TOTN v1 semble plus 3D visuellement, ce n’est pas encore un vrai moteur 3D :\n\n[enum=1]• il n’y a pas de rasterisation triangle par triangle,[/enum]\n\n[enum=1]• pas de vraie projection 3D complète,[/enum]\n\n[enum=1]• les modèles ne sont pas des meshes 3D au sens classique,[/enum]\n\n[enum=1]• tout repose encore sur des transformations simplifiées.[/enum]\n\nC’était en réalité une version améliorée du moteur de Mario, poussée au maximum de ce que la 2.5D peut offrir sur Casio.\nCe projet m’a servi de transition et m’a donné envie de passer à la vraie 3D.",
              "medias": [
                "assets/projects/3d-engines/medias/demo 2.5d.mp4",
                "assets/projects/3d-engines/medias/Screenshot_20230926_164155_Gallery.jpg",
                "assets/projects/3d-engines/medias/Screenshot_20230926_164217_Gallery.jpg",
                "assets/projects/Mario3D/icon.jpg",
                "assets/projects/Mario3D/medias/Participation à la Game Jam 2023 Casio (Super Mario 3D) 1-10 screenshot.png",
                "assets/projects/Mario3D/medias/20230425_025650.jpg",
                "assets/projects/ZeldaTOTN/v1/IMG_20230630_212123_210.jpg",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 1-58 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/wrr8.gif"
              ]
            },
            {
              "title": "Mini 3D Engine (devlogs Planète Casio)",
              "description": "Mon topic “mini moteur 3D” sur Planète Casio montre plusieurs prototypes intermédiaires :\ntests de perspective, rasterization, texturing minimaliste, rendu polygonal, etc.\n\nC’est dans ce projet-là que j’ai mis au point certaines fonctions cruciales :\n\n[enum=1]• approximation ultra-rapide d’atan2 (inspirée du code Quake III),[/enum]\n\n[enum=1]• division optimisée,[/enum]\n\n[enum=1]• gestion de matrices simplifiée.[/enum]\n\nTout ceci m’a servi plus tard dans TOTN v2 et dans mes autres moteurs.",
              "medias": [
                "assets/projects/3d-engines/medias/20250321_023310.mp4",
                "assets/projects/3d-engines/medias/20250321_112604.mp4",
                "assets/projects/3d-engines/medias/20250321_165423.mp4",
                "assets/projects/3d-engines/medias/20250323_150132.jpg",
                "assets/projects/3d-engines/medias/20250324_150622.jpg",
                "assets/projects/3d-engines/medias/20240608_034809.mp4",
                "assets/projects/3d-engines/medias/20240608_200515.mp4",
                "assets/projects/3d-engines/medias/20241018_005729.mp4",
                "assets/projects/3d-engines/medias/Capture d'écran 2024-10-25 150614.png",
                "assets/projects/3d-engines/medias/Casio Moteur 3D x Unity 3D Update.mp4"
              ]
            },
            {
              "title": "Moteur 3D entièrement refait",
              "description": "Avec TOTN v2, j’ai enfin franchi le cap :\nC’est ma première implémentation d’un moteur 100 % 3D, réécrite from scratch en C++.\n\nCette version introduit enfin un rendu 3D réel :\n\n[enum=1]• projection en perspective,[/enum]\n\n[enum=1]• polygones et triangles texturés,[/enum]\n\n[enum=1]• transformations 3D complètes (matrices, rotation, translation, scale),[/enum]\n\n[enum=1]• un vrai pipeline d’entités 3D,[/enum]\n\n[enum=1]• gestion de camera avec rotation libre,[/enum]\n\n[enum=1]• architecture orientée objet, bien plus extensible.[/enum]\n\nTOTN v2 n’est pas une évolution :\nc’est un nouveau moteur 3D, bien plus optimisé, plus propre et capable d’afficher des scènes réellement 3D.",
              "medias": [
                "assets/projects/ZeldaTOTN/v2/2b37.gif",
                "assets/projects/ZeldaTOTN/v2/casio.gif",
                "assets/projects/3d-engines/medias/Encore une démo 3D pour Casio.mp4",
                "assets/projects/3d-engines/medias/Unity3D To Casio.mp4"
              ]
            },
            {
              "title": "Ce que ces projets m’ont apporté",
              "description": "Développer un moteur 3D sur un support aussi limité m’a obligé à :\n\n[enum=1]• apprendre la rigueur mathématique,[/enum]\n\n[enum=1]• comprendre les vraies bases du rendu 3D,[/enum]\n\n[enum=1]• repenser mes algorithmes pour les rendre plus légers,[/enum]\n\n[enum=1]• optimiser sans cesse,[/enum]\n\n[enum=1]• structurer mes projets comme le feraient les développeurs des années 90,[/enum]\n\n[enum=1]• rechercher en profondeur pour améliorer le pipeline.[/enum]\n\nÀ l’avenir, j’aimerais aller plus loin :\npasser à un rendu GPU, explorer le multi-threading, et continuer à affiner mon pipeline logiciel.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "arboris",
      "title": "Arboris",
      "date": "Août 2025",
      "duration": "1 mois",
      "category": [
        "Casio",
        "Game development"
      ],
      "icon": "assets/projects/Arboris/icon.jpg",
      "description": "[b]Arboris[/b] est un jeu que j’ai développé dans le cadre du Casio Programming Contest 32 (CPC32), organisé par la communauté Planète Casio.\nLe thème de cette édition était [i]“L’appel de la nature”[/i].\n\nJe voulais sortir de ma zone de confort. J’avais déjà réalisé plusieurs jeux 2D classiques (type Mario, RPG Maker) et même quelques projets 3D, mais je n’avais encore jamais réussi à finaliser correctement un vrai [u]jeu isométrique[/u] — ma précédente tentative, Isocraft (minecraft isométrique), n’était qu’un prototype expérimental.\nC’était donc l’occasion idéale de m’y essayer — surtout sur un support aussi contraignant que la calculatrice graphique Casio, où chaque pixel et chaque cycle processeur compte.\n\n[url=https://www.planet-casio.com/Fr/programmes/programme4590-last-arboris-farhi-jeux-reflexion.html]Lien du jeu[/url]",
      "media": "assets/projects/Arboris/Image Principale.png",
      "medias": [
        "assets/projects/Arboris/galerie/Arboris Demo.mp4",
        "assets/projects/Arboris/galerie/Capture d'écran 2025-08-30 192035.png",
        "assets/projects/Arboris/galerie/20250831_144441.jpg"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Choix du style",
              "description": "À première vue, un jeu isométrique paraît simple : il s’agit d’afficher une grille en diagonale et de donner de la profondeur aux blocs.\nMais sur une calculatrice, la réalité est tout autre.\nChaque bloc affiché coûte énormément en performance, et les limitations matérielles se font sentir dès les premières lignes de code.\n\nPour contourner ces contraintes, j’ai conçu un système de culling : le jeu n’affiche que les blocs visibles à l’écran, ce qui réduit drastiquement le coût de rendu.\nCe système a été la première grande étape vers un affichage fluide malgré la complexité du relief.\n\nMais la véritable difficulté est venue des entités — ces éléments qui se déplacent dans le monde.\nLeur ordre d’affichage dépend de leur position relative aux blocs environnants.\nLorsqu’une entité se trouve “entre deux blocs”, il faut déterminer précisément à quel moment elle doit être dessinée pour ne pas apparaître devant ou derrière le mauvais élément.\n\nJ’ai résolu ce problème en découpant chaque entité en segments verticaux, appelés “semi-blocs”.\nAinsi, une entité large d’un bloc est dessinée en plusieurs parties, ce qui permet une superposition correcte avec le décor.\nCe système m’a demandé plusieurs essais, mais il a complètement réglé les problèmes de chevauchement et d’ordre d’affichage.",
              "medias": [
                "assets/projects/Arboris/debug/bugs.png",
                "assets/projects/Arboris/debug/20250819_164621.mp4",
                "assets/projects/Arboris/debug/20250822_025100.jpg",
                "assets/projects/Arboris/debug/Capture d'écran 2025-08-26 212722.png"
              ]
            },
            {
              "title": "Conception du gameplay",
              "description": "Arboris est un jeu de réflexion isométrique inspiré du style de Capitaine Toad.\nLe joueur y incarne un petit personnage chargé de faire fleurir des arbres dans un monde composé de blocs et de plateformes en 3D simulée.\n\nPour terminer un niveau, il faut rassembler trois éléments essentiels :\n[enum=1]🌰 les graines[/enum]\n[enum=1]💧 les arrosoirs[/enum]\n[enum=1]🌿 la terre fertile[/enum]\n\nUne fois tous les arbres plantés et arrosés, le niveau est validé.\nChaque carte demande de réfléchir à l’ordre d’action : il faut parfois préparer le terrain, activer des interrupteurs, ou éviter des pièges avant de pouvoir accéder à toutes les ressources.\n\nLe jeu propose également plusieurs éléments interactifs :\n\n[enum=1]• Des boutons ON/OFF qui modifient la structure du niveau (portes, ponts, ou blocs solides/fantômes)[/enum]\n[enum=1]• Des ennemis et des zones dangereuses comme l’eau, la lave ou le poison, qui provoquent un échec instantané[/enum]\n[enum=1]• La gravité et des collisions + un système permettant de grimper automatiquement les marches[/enum]\n\nLe gameplay repose donc sur un équilibre entre observation, logique et maîtrise de la perspective.",
              "medias": []
            },
            {
              "title": "L’éditeur de niveaux",
              "description": "À l’origine, j’avais développé un éditeur de niveaux uniquement pour moi, afin de construire plus facilement les cartes du jeu sans les coder à la main.\nMais au fur et à mesure du développement, je me suis rendu compte que cet outil avait un vrai potentiel pour les joueurs.\nJe l’ai donc rendu accessible à tous, permettant à la communauté de créer et partager leurs propres niveaux.\n\nCe choix a donné une nouvelle dimension au projet : Arboris n’est plus seulement un jeu, mais aussi un petit bac à sable où chacun peut expérimenter.\nCela a aussi permis de prolonger la durée de vie du jeu, en offrant un contenu renouvelable et participatif.",
              "medias": [
                "assets/projects/Arboris/editeur/Capture d'écran 2025-08-30 161258.png",
                "assets/projects/Arboris/editeur/Capture d'écran 2025-08-30 032507.png",
                "assets/projects/Arboris/editeur/Capture d'écran 2025-08-26 212829.png",
                "assets/projects/Arboris/editeur/20250825_190853.jpg"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zelda-totn",
      "title": "Zelda TOTN",
      "date": "Mai 2023 – aujourd’hui",
      "duration": "3 ans et 1 mois",
      "category": [
        "Casio",
        "Game development"
      ],
      "icon": "assets/projects/ZeldaTOTN/icon.jpg",
      "description": "[b]Zelda: Tears of the NES[/b] (ou Zelda TOTN) est un projet que j’ai commencé à développer dans le cadre du Casio Programming Contest 30 (CPC30) organisé par Planète Casio, dont le thème était [i]« Les profondeurs »[/i].\nCe jeu marque la suite directe de mes expérimentations 3D sur calculatrice, amorcées avec [projet=mario3d]Super Mario 3D[/projet].\nMon objectif : transformer ce moteur prototype en un [u]véritable moteur d’action-aventure 3D[/u], capable de gérer une carte complète, un système d’inventaire, des entités, et de multiples interactions complexes.\n\nC’est aussi le projet qui m’a réellement lancé dans la conception de moteurs 3D maison : il m’a permis de dépasser la simple démonstration technique pour m’approcher d’un jeu.\n\n[url=https://www.planet-casio.com/Fr/programmes/programme4350-last-zelda-tears-of-the-nes-farhi-jeux-add-ins.html]Lien du jeu[/url]",
      "media": "assets/projects/ZeldaTOTN/Image Principale.png",
      "medias": [
        "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Calculatrice Casio.mp4",
        "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 0-19 screenshot.png",
        "assets/projects/ZeldaTOTN/v1/casio-menu-gif.gif",
        "assets/projects/ZeldaTOTN/v1/wrr8.gif"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Version 1 — Démo initiale (C / gint)",
              "description": "La première version de Zelda: Tears of the NES est née dans le cadre du CPC30.\nElle utilisait le moteur de Super Mario 3D que j’ai profondément modifié et étendu.\nCette version, écrite en C (gint), servait avant tout de preuve de concept et de base pour le développement futur.\n\nFondations techniques\n\nParmi les ajouts majeurs de cette v1 :\n\n[enum=1]• un système de gestion de la lumière/zones d’éclairage[/enum]\n[enum=1]• une réécriture du système d’entités[/enum]\n[enum=1]• une optimisation du chargement des modèles, pour éviter la surcharge mémoire[/enum]\n\nLe plus grand défi venait de la limite de taille des programmes Casio (2 Mo).\nLe jeu contenait plusieurs centaines de types d’objets et plus de 470 sprites d’items, ce qui aurait saturé la mémoire interne.\nPour contourner cela, j’ai conçu un système de ressources externes :\nles sprites et les cartes sont stockés dans des fichiers binaires séparés, chargés et déchargés selon les besoins.",
              "medias": [
                "assets/projects/ZeldaTOTN/v1/IMG_20230630_212123_072.jpg",
                "assets/projects/ZeldaTOTN/v1/IMG_20230630_212123_210.jpg",
                "assets/projects/ZeldaTOTN/v1/20230530_131415.jpg",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 1-23 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 1-44 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 1-58 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 2-40 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 3-44 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 0-55 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 1-4 screenshot.png"
              ]
            },
            {
              "title": "Gameplay et contenu",
              "description": "Dans cette première version, le joueur explore un monde en ruine inspiré de The Legend of Zelda.\nLe moteur repose sur une caméra 2.5D avec rotation partiellement.\n\nLe joueur peut :\n\n[enum=1]• ramasser, consulter et jeter des objets[/enum]\n\n[enum=1]• utiliser l’arc et les flèches, épée et bouclier[/enum]\n\n[enum=1]• subir des dégâts de chute selon la hauteur[/enum]\n\nUne mini-carte a été ajoutée, elle réutilise le code de mon projet [projet=rpg-maker]RPG Maker[/projet] pour gérer l'affichage.\nL’interface et les menus ont été retravaillés pour plus de clarté, notamment sur les versions Windows et Linux, qui ajoutent la reconfiguration des touches.",
              "medias": [
                "assets/projects/ZeldaTOTN/v1/Zelda TOTN MAJ.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 2-6 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 2-12 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/Zelda Tears Of The NES pour Casio 3-44 screenshot.png",
                "assets/projects/ZeldaTOTN/v1/llra.png"
              ]
            },
            {
              "title": "Un travail sur les items",
              "description": "Le système d’items a été une partie compliquée à développer.\nJ’ai dû :\n\n[enum=1]• aligner manuellement 470 sprites[/enum]\n[enum=1]• les intégrer dans un fichier binaire unique[/enum]\n[enum=1]• créer un lecteur capable d’extraire le bon sprite à la volée tout en déchargeant les anciens/inutilisés[/enum]",
              "medias": [
                "assets/projects/ZeldaTOTN/v1/zj6v.png"
              ]
            },
            {
              "title": "Version 2 — Refonte complète du moteur (C++ / gint + Azur)",
              "description": "Suite à la v1, j’ai entrepris une refonte intégrale du moteur, cette fois en C++, afin d’améliorer les performances et d’élargir les possibilités du jeu.\nCette v2 utilise le duo gint + Azur, ce qui me permet d’aller beaucoup plus loin que ce que la v1 pouvait supporter.\n\nAméliorations techniques majeures :\n\n[enum=1]• Moteur 3D entièrement réécrit, avec un pipeline de rendu plus flexible et bien plus rapide.[/enum]\n\n[enum=1]• Gestion de la lumière revisitée[/enum]\n\n[enum=1]• Nouveau système d’entités : structure orientée objet, interactions et collisions améliorées.[/enum]\n\n[enum=1]• Animations et modèles plus détaillés, avec davantage de formes géométriques possibles.[/enum]\n\n[enum=1]• Caméra rotative et déplacements libres[/enum]\n\n[enum=1]• Une skybox en deux couleurs[/enum]\n\nCette refonte vise à rendre le moteur plus proche d’un véritable moteur de jeu 3D moderne, tout en restant compatible avec les contraintes de la Casio Graph 90 ( et des versions PC/Linux).",
              "medias": [
                "assets/projects/ZeldaTOTN/v2/2b37.gif",
                "assets/projects/ZeldaTOTN/v2/casio.gif",
                "assets/projects/ZeldaTOTN/v2/7tn5.gif",
                "assets/projects/ZeldaTOTN/v2/Zelda TOTN édition de map.mp4",
                "assets/projects/ZeldaTOTN/v2/Capture-d-cran-2025-05-12-013515.png"
              ]
            },
            {
              "title": "État actuel et perspectives",
              "description": "La v1 a posé les bases : moteur fonctionnel, gestion d’inventaire, ressources externes, et gameplay testable.\nLa v2 en cours de développement apporte une architecture C++ beaucoup plus souple, des optimisations poussées et une refonte totale du rendu.\nCertaines fonctionnalités restent encore à implémenter (ennemis, pouvoirs, carte complète), mais le projet avance avec une meilleure stabilité et des performances accrues.",
              "medias": []
            },
            {
              "title": "Bilan et apprentissages",
              "description": "Zelda: Tears of the NES est avant tout un laboratoire technique pour la 3D sur calculatrice.\nIl m’a permis d’approfondir :\n\n[enum=1]• la gestion mémoire[/enum]\n\n[enum=1]• l’architecture multiplateforme[/enum]\n\n[enum=1]• la création d’un moteur 3D sous fortes contraintes[/enum]\n\nC’est aujourd’hui l’un de mes projets les plus ambitieux.\nLa v1 m’a permis de prouver que c’était faisable ; la v2 vise à montrer que c’est optimisable.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "mario3d",
      "title": "Mario 3D",
      "date": "Avril 2023",
      "duration": "10 jours",
      "category": [
        "Casio",
        "Game development"
      ],
      "icon": "assets/projects/Mario3D/icon.jpg",
      "description": "Ce jeu a été développé dans le cadre de la Chill Casio Jam #2 organisée par la communauté Planète Casio. \nPour moi, c’était le début d’une passion : [u]créer du rendu 3D sur calculatrice[/u].\nMais la 3D native sur une machine comme la Casio Graph 90+E, c’est extrêmement coûteux. J’ai donc choisi d’opter pour de la [i]2.5D[/i], une sorte de rendu 3D simplifié, qui permet d’obtenir l’effet tout en gardant des performances acceptables.\n\n[url=https://www.planet-casio.com/Fr/programmes/programme4343-last-super-mario-3d-farhi-jeux-add-ins.html]Lien du jeu[/url]",
      "media": "assets/projects/Mario3D/Image Principale.jpg",
      "medias": [
        "assets/projects/Mario3D/medias/video.mp4",
        "assets/projects/Mario3D/medias/20230425_025650.jpg",
        "assets/projects/Mario3D/medias/20230425_025704.jpg",
        "assets/projects/Mario3D/medias/Participation à la Game Jam 2023 Casio (Super Mario 3D) 1-10 screenshot.png",
        "assets/projects/Mario3D/medias/Participation à la Game Jam 2023 Casio (Super Mario 3D) 1-46 screenshot.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Techniques et optimisations majeures",
              "description": "Le principal défi de Super Mario 3D était d’obtenir un rendu pseudo-3D fluide sur une machine qui n’est pas faite pour ça.\nPour y parvenir, j’ai pris plusieurs décisions techniques cruciales.\n\nD’abord, j’ai remplacé les nombres flottants par des fixed points, c’est-à-dire des valeurs entières représentant des décimales via un facteur d’échelle.\nCette méthode supprime totalement les calculs en virgule flottante, beaucoup trop lourds sur calculatrice, tout en gardant une bonne précision pour les positions et les mouvements.\nRésultat : des calculs de physique et de projection plus rapides d’un facteur considérable, sans aucune perte visible pour le joueur.\n\nEnsuite, j’ai choisi de rester en 2.5D plutôt que de basculer en vraie 3D.\nCette approche me permettait de simuler la profondeur et la perspective sans avoir à calculer des sinus et cosinus en permanence pour la rotation de la caméra ou la projection des objets.\nEn pratique, tout repose sur une géométrie simplifiée, où les éléments sont rendus à plat avec un léger décalage vertical et une échelle variable selon leur distance.\nCela réduit drastiquement la charge de calcul tout en conservant une illusion 3D crédible.\n\nGrâce à ces choix, le moteur tourne de façon stable, même avec plusieurs éléments à l’écran.\nCette base technique m’a ensuite servi pour mes projets 3D suivants, où j’ai pu réintroduire progressivement des calculs plus complexes tout en gardant une architecture optimisée.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "rpg-maker",
      "title": "RPG Maker",
      "date": "2020 – 2021",
      "duration": "Environ 1 an",
      "category": [
        "Casio",
        "Game development"
      ],
      "icon": "assets/projects/RPG-Maker/icon.jpg",
      "description": "Quand j’ai commencé à apprendre Python, je me suis fixé un objectif ambitieux pour progresser : [u]recréer le moteur de RPG Maker MV[/u].\nJe découvre mieux en construisant, et refaire un moteur connu m’obligeait à toucher à tout : affichage, collisions, gestion des tiles, inventaire, scripts, réseau, structure des données…\n\nÀ cette époque, j’avais une compréhension limitée des bonnes pratiques, mais beaucoup d’enthousiasme.\nJ’ai donc développé mon premier clone de [b]RPG Maker MV[/b] en Python/Pygame, avec :\n\n[enum=1]• un rendu graphique (via pygame) très proche de RPG Maker MV[/enum]\n\n[enum=1]• un éditeur interne[/enum]\n\n[enum=1]• un “système multijoueur” expérimental via socket[/enum]\n\n[enum=1]• un gestionnaire de comptes utilisateur (avec… un chiffrement César, oui, la catastrophe)[/enum]\n\n[enum=1]• des tonnes de librairies utilisées juste pour apprendre[/enum]\n\nLe résultat fonctionnait, mais c’était une purge en termes de code :\ndes variables globales partout, un seul fichier de 3000 lignes, des while True infinis, des break/continue à outrance, très peu de classes, aucune séparation logique… bref, un [i]enfer à relire aujourd’hui[/i].\n\nMais ce premier essai m’a donné la base de ce qui deviendrait l’un de mes projets les plus formateurs.",
      "media": "assets/projects/RPG-Maker/Image Principale.jpg",
      "medias": [
        "assets/projects/RPG-Maker/media/Éditeur RPG directement sur Casio et compatible sur ordinateur.mp4",
        "assets/projects/RPG-Maker/media/20220212_232854.jpg",
        "assets/projects/RPG-Maker/media/c86s.jpg",
        "assets/projects/RPG-Maker/media/d2c2.jpg",
        "assets/projects/RPG-Maker/media/fude.jpg",
        "assets/projects/RPG-Maker/media/IMG_20220213_183208.jpg",
        "assets/projects/RPG-Maker/media/2ur5.jpg",
        "assets/projects/RPG-Maker/media/wdyv.jpg",
        "assets/projects/RPG-Maker/media/0jxk.jpg",
        "assets/projects/RPG-Maker/media/unnamed.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Rétro-ingénierie de RPG Maker MV",
              "description": "Quelques années plus tard, j’ai voulu comprendre réellement comment RPG Maker MV avait été conçu.\nJ’ai donc fait ce que je n’avais pas osé au début : l’analyser en profondeur.\n\nJ’ai rétro-ingéniéré RPG Maker MV et découvert l’ingéniosité de ses systèmes internes.\n\nUn exemple frappant :\nRPG Maker utilise un principe de “Tile Autotile”.\nAvec 6 blocs de base, découpés en sous-morceaux, on peut automatiquement générer 47 variantes d’un même type de terrain.\nDans ma première version Python, j’avais naïvement enregistré les 47 blocs complets × tous les tiles, ce qui explosait la RAM et l’espace disque.\n\nAprès avoir étudié le système, j’ai entièrement recréé le même fonctionnement, cette fois de manière propre.\n\nJe me suis alors mis à réécrire tout le moteur, mais correctement, en :\n\n[enum=1]• Python[/enum]\n[enum=1]• C[/enum]\n[enum=1]• C++[/enum]\n\nEn parallèle, j’ai aussi recréé :\n\n[enum=1]• l’interpréteur d’évènements[/enum]\n[enum=1]• le parsing des maps[/enum]\n[enum=1]• la logique interne[/enum]\n[enum=1]• les systèmes de transitions, collisions, couches, animations…[/enum]\n\nBref, un vrai clone technique de RPG Maker, mais version “from scratch”.\n\nEt comme RPG Maker MV utilise du JavaScript, j’ai dû apprendre le JavaScript au passage pour comprendre exactement comment le moteur original fonctionnait.",
              "medias": [
                "assets/projects/RPG-Maker/media/6ktd.png",
                "assets/projects/RPG-Maker/media/61095-b8bbb1763f55cda3d7eceb32e4843344.png"
              ]
            },
            {
              "title": "Une version Casio — la contrainte maximale",
              "description": "Après avoir consolidé mon moteur, j’ai voulu le porter sur un support extrême :\nla Casio Graph 90+E, qui impose une limite :\n\n👉 Un programme ne peut pas dépasser 2 Mo (code + images + texte inclus).\n\nRPG Maker, lui, utilise des centaines d’assets.\n\nPour que le port fonctionne, j’ai dû :\n\n[enum=1]• stocker une partie des images en dehors du programme dans un fichier binaire[/enum]\n\n[enum=1]• mettre en place un chargement/déchargement dynamique pour ne jamais saturer la RAM[/enum]\n\n[enum=1]• intégrer un culling strict pour n’afficher que les tiles visibles[/enum]\n\n[enum=1]• compresser ou restructurer les données[/enum]\n\nCe port Casio a été l’une des versions les plus difficiles, mais aussi l’une des plus enrichissantes :\nil m’a poussé à comprendre la structure de RPG Maker MV dans le détail, et à développer des systèmes réutilisables ensuite dans d’autres projets (comme Underworld, ou même certaines briques techniques de Particule SDK).",
              "medias": []
            },
            {
              "title": "Compréhension, rigueur et héritage technique",
              "description": "Recréer RPG Maker de cette manière m’a appris :\n\n[enum=1]• à analyser un moteur professionnel,[/enum]\n\n[enum=1]• à comprendre la gestion de tiles, de couches, de transitions et d’autotiles,[/enum]\n\n[enum=1]• à architecturer un moteur modulaire,[/enum]\n\n[enum=1]• à optimiser méthodiquement sous contrainte,[/enum]\n\n[enum=1]• à écrire un interpréteur d’évènements,[/enum]\n\n[enum=1]• à mieux structurer mes projets,[/enum]\n\n[enum=1]• et surtout : à ne plus refaire les erreurs de ma première version.[/enum]\n\nCe projet a profondément influencé la manière dont je conçois mes moteurs actuels.\nC’est aussi l’un des déclencheurs qui m’ont poussé à m’intéresser sérieusement :\n\n[enum=1]• à l’optimisation bas niveau,[/enum]\n\n[enum=1]• à la sécurité et au chiffrement (qui ont refait surface à EPITA lorsque j’ai recodé RSA en OCaml),[/enum]\n\n[enum=1]• et à la rétro-ingénierie de moteurs professionnels.[/enum]",
              "medias": [
                "assets/projects/RPG-Maker/media/8dm6.png",
                "assets/projects/RPG-Maker/media/fude.jpg",
                "assets/projects/RPG-Maker/media/2ur5.jpg",
                "assets/projects/RPG-Maker/media/wdyv.jpg"
              ]
            },
            {
              "title": "Aujourd’hui",
              "description": "Mon moteur RPG Maker “from scratch” existe sous plusieurs formes : Python, C, C++, et une version Casio c++ optimisée.\nJe le réutilise et l’améliore encore dans certains projets, car sa structure solide et sa modularité en font une base idéale pour créer des jeux narratifs 2D.\n\nIl fait partie des projets qui ont marqué mon apprentissage au plus haut point, et qui m’ont imposé une rigueur dont je me sers aujourd’hui dans tous mes projets modernes.",
              "medias": []
            }
          ]
        }
      ]
    },
    {
      "id": "temple-warriors",
      "title": "Temple Warriors",
      "date": "Avril 2025",
      "duration": "2 semaines",
      "category": [
        "Casio",
        "Game development"
      ],
      "icon": "assets/projects/TempleWarriors/icon.jpg",
      "description": "[b]TempleWarriors[/b] est un jeu que j’ai développé dans le cadre du concours Casio Python Jam #2, organisé par Planète Casio — et que j’ai eu la chance de remporter 🏆.\nOn avait pour mission de coder un jeu autour du thème imposé [i]\"Le gardien du Temple\"[/i]\n\nHabituellement, les jeux Casio que j'écris sont en C ou C++.\nFaire un jeu d’action en Python représentait donc un [u]vrai défi technique[/u] : chaque rafraîchissement de l’écran, chaque déplacement, chaque collision coûtait énormément en performances, bien plus qu'en C++.\nCe projet m’a forcé à repenser complètement ma manière de programmer sur cette machine.\n\n[url=https://www.planet-casio.com/Fr/programmes/programme4546-last-templewarriors-farhi-jeux-strategie.html]Lien du jeu[/url]",
      "media": "assets/projects/TempleWarriors/Image Principale.png",
      "medias": [
        "assets/projects/TempleWarriors/medias/kKkdLFg.png",
        "assets/projects/TempleWarriors/medias/Farhi - Temple Warrior.mp4",
        "assets/projects/TempleWarriors/medias/q5BZMVQ.png",
        "assets/projects/TempleWarriors/medias/2kwg7W3.png",
        "assets/projects/TempleWarriors/medias/Capture-d-cran-2025-04-27-182243.png"
      ],
      "pages": [
        {
          "name": "Contexte",
          "sections": [
            {
              "title": "Optimisation — contourner les limites du Python",
              "description": "Au début, je voulais une caméra dynamique qui suive le joueur, mais cela aurait obligé le jeu à rafraîchir tout l’écran à chaque frame. Le jeu ramerait tellement qu'il serait injouable.\nJ’ai donc opté pour une approche différente : un découpage du temple en zones.\n\nLe principe :\n[enum=1]• La carte est divisée en sections fixes.[/enum]\n[enum=1]• Lorsque le joueur atteint un bord, la zone suivante s'affiche entièrement.[/enum]\n\nPendant les déplacements, seuls les blocs directement affectés sont redessinés à l’écran, ce qui évite toute traînée de pixels et réduit le coût de rendu.\n\nGrâce à ce système, le jeu tourne de façon fluide, même en Python.\n\nAutre point complexe : les marches diagonales.\nElles ne sont pas de simples blocs carrés, mais de véritables pentes.\nLe joueur devait rester “collé” au sol (snap) tout en pouvant sauter à tout moment, et les collisions devaient aussi fonctionner par-dessous, sur une diagonale et non sur un rectangle.\n\nPour les ennemis, j’ai choisi une approche complètement différente.\nCréer une vraie physique avec collisions et gravité aurait été beaucoup trop coûteux en Python, surtout quand plusieurs dizaines d’ennemis sont présents.\nJ’ai donc mis en place un système de nœuds invisibles, formant un graphe orienté qui définit les chemins que les monstres peuvent suivre dans le temple.\n\nChaque ennemi se contente de se déplacer linéairement d’un nœud à l’autre :\n\n[enum=1]• s’ils sont alignés horizontalement, ils marchent simplement[/enum]\n[enum=1]• verticalement, ils chutent (avec une vitesse modifiée pour \"simuler\" une gravité)[/enum]\n[enum=1]• en diagonale, ils montent ou descendent des marches[/enum]\n\nCe système ne nécessite donc aucun calcul physique complexe : tout est pré-calculé et parfaitement cohérent, puisque le décor ne change jamais.\nLorsqu’un ennemi atteint un nœud, il choisit aléatoirement une des connexions disponibles, ce qui rend ses déplacements \"pseudo-imprévisibles\" sans nécessiter d’IA avancée.\nEt s’il arrive sur un nœud sans sortie, cela signifie qu’il a atteint sa cible finale — cristal à attaquer.\n\nCe mécanisme, inspiré de mes cours d’algorithmique, a permis de multiplier le nombre d’ennemis à l’écran sans perte de fluidité.\nEn pratique, cela change tout : on a l’impression que les monstres possèdent un vrai comportement, alors qu’ils ne font que suivre des trajectoires intelligemment préparées.",
              "medias": [
                "assets/projects/TempleWarriors/medias/Capture-d-cran-2025-04-27-190815.png",
                "assets/projects/TempleWarriors/medias/wcKklfw.png",
                "assets/projects/TempleWarriors/medias/KbGZADt.png"
              ]
            },
            {
              "title": "Gameplay — défendre le temple",
              "description": "Dans TempleWarriors, on incarne le Gardien d’un temple sacré envahi par des monstres.\nVotre mission : protéger les trois cristaux du sanctuaire, coûte que coûte.\nSi le joueur meurt ou qu’un cristal est détruit, la partie est terminée.\n\nLe jeu se joue comme un action-platformer : on saute, on attaque, on esquive, et on gère plusieurs ennemis à la fois.\nLa difficulté vient surtout du positionnement et de la gestion des vagues d’ennemis qui arrivent sans relâche.\n\nUne mini-carte dans le menu pause permet de visualiser :\n[enum=1]• les cristaux (points verts)[/enum]\n[enum=1]• les monstres (points rouges)[/enum]\n[enum=1]• et le joueur (point blanc)[/enum]\n\nLe but est de tenir le plus longtemps possible, vague après vague.\nToutes les cinq vagues, des objets apparaissent aléatoirement dans le temple :\n\n[enum=1]• 💖 des cœurs pour régénérer la vie[/enum]\n[enum=1]• 💎 des fragments de cristal pour réparer les cristaux[/enum]\n\nCes objets n’apparaissent pas sur la mini-carte : il faut explorer le temple pour les trouver.",
              "medias": []
            },
            {
              "title": "La version C++ — un second souffle",
              "description": "Après la jam, j’ai voulu pousser le concept plus loin.\nJ’ai donc reprogrammé entièrement le jeu en C++, cette fois sous forme d’add-in.\nGrâce à la puissance du langage, j’ai pu ajouter une caméra fluide qui suit le joueur en continu, améliorer la réactivité, et rééquilibrer la difficulté.\n\nJ’ai aussi intégré :\n\n[enum=1]• un système de vagues progressif[/enum]\n[enum=1]• un affichage du score final (temps + vague atteinte)[/enum]\n[enum=1]• une interface multilingue (français/anglais)[/enum]\n\nCette version C++ est aujourd’hui considéré comme la version principale de TempleWarriors, bien plus stable, fluide et complète que l’originale, tout en restant fidèle à l’esprit du concours.",
              "medias": []
            }
          ]
        }
      ]
    }
  ]
};
