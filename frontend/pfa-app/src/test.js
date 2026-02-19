// / Soumission du formulaire
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   console.log("🚀 Formulaire soumis !");

//   //   if (formData.motDePasseHash !== formData.confirmation) {
//   //     alert("Les mots de passe ne correspondent pas !");
//   //     return;
//   //   }

//   //   const formDataToSend = new FormData();
//   //   Object.keys(formData).forEach((key) =>
//   //     formDataToSend.append(key, formData[key])
//   //   );

//   //   if (image) {
//   //     formDataToSend.append("ImageUpload", image);
//   //   }

//   //   try {
//   //     const response = await axios.post(API_URL, formDataToSend, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     alert("Inscription réussie !");
      
//   //     // Réinitialiser le formulaire sauf l'aperçu de l'image
//   //     setFormData({
//   //       nom: "",
//   //       prenom: "",
//   //       dateDeNaissance: "",
//   //       cin: "",
//   //       email: "",
//   //       telephone: "",
//   //       adresse: "",
//   //       login: "",
//   //       motDePasseHash: "",
//   //       confirmation: "",
//   //     });

//   //   } catch (error) {
//   //     console.error("Erreur lors de l'inscription", error);
//   //   }
//   // };
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   console.log("🚀 Début de la soumission");
  
//   //   // Validation des mots de passe
//   //   if (formData.motDePasseHash !== formData.confirmation) {
//   //     alert("Les mots de passe ne correspondent pas !");
//   //     return;
//   //   }
  
//   //   try {
//   //     // Construction minutieuse du FormData
//   //     const formDataToSend = new FormData();
      
//   //     // Ajout de chaque champ individuellement avec vérification
//   //     const fields = [
//   //       'nom', 'prenom', 'dateDeNaissance', 'cin', 
//   //       'email', 'telephone', 'adresse', 'login', 'motDePasseHash'
//   //     ];
      
//   //     fields.forEach(field => {
//   //       if (formData[field]) {
//   //         formDataToSend.append(field, formData[field]);
//   //       } else {
//   //         console.warn(`Champ manquant : ${field}`);
//   //       }
//   //     });
  
//   //     // Ajout de l'image avec un nom de champ qui correspond à l'API
//   //     if (image) {
//   //       formDataToSend.append("file", image); // Essayez aussi "image" ou "ImageFile" si "file" ne marche pas
//   //     }
  
//   //     console.log("📦 Données à envoyer :", Object.fromEntries(formDataToSend));
  
//   //     // Envoi avec timeout et gestion d'erreur améliorée
//   //     const response = await axios.post(API_URL, formDataToSend, {
//   //       headers: { 
//   //         "Content-Type": "multipart/form-data",
//   //       },
//   //       timeout: 5000 // 5 secondes timeout
//   //     });
  
//   //     console.log("✅ Réponse du serveur :", response.data);
//   //     alert("Inscription réussie !");
  
//   //     // Réinitialisation
//   //     setFormData({
//   //       nom: "",
//   //       prenom: "",
//   //       dateDeNaissance: "",
//   //       cin: "",
//   //       email: "",
//   //       telephone: "",
//   //       adresse: "",
//   //       login: "",
//   //       motDePasseHash: "",
//   //       confirmation: "",
//   //     });
//   //     setImage(null);
//   //     setPreview("");
  
//   //   } catch (error) {
//   //     console.error("❌ Erreur complète :", error);
      
//   //     // Affichage détaillé des erreurs de validation
//   //     if (error.response?.data?.errors) {
//   //       const errorMessages = Object.values(error.response.data.errors).flat().join("\n");
//   //       alert(`Erreurs de validation :\n${errorMessages}`);
//   //     } else {
//   //       alert(`Erreur : ${error.response?.data?.message || error.message}`);
//   //     }
//   //   }
//   // };