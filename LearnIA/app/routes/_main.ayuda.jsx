
import TitleWithImages from "../components/TitleWithImages";
import CollapsibleSection from "../components/CollapsibleSection";

import "../styles/MisCursos.css";

function ayuda() {
	
	return (
		<div>
			<TitleWithImages title="Ayuda" />
			

			<CollapsibleSection title="¿Qué es Learn-IA y cómo puede ayudarme en mi educación?">
				<p>
				Learn-IA es una plataforma educativa que utiliza Inteligencia Artificial generativa para ofrecer un aprendizaje personalizado. Te permite repasar, profundizar e incluso adelantarte en los temas de tus cursos, adaptándose a tus necesidades individuales.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Cómo funciona la personalización del aprendizaje en Learn-IA?">
				<p>
				Learn-IA evalúa tus conocimientos previos y te proporciona recomendaciones de aprendizaje personalizadas. Además, crea un plan de estudio ajustado a tu ritmo y necesidades, con explicaciones breves, cuestionarios adaptados y sugerencias de proyectos.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Cómo puedo empezar a usar Learn-IA?">
				<p>
				Puedes crear una cuenta utilizando tu cuenta de Google institucional e ingresando tu carrera. Desde allí, podrás agregar materias de diferentes semestres, establecer tu plan de estudio y comenzar a aprender de manera personalizada.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Qué tipo de evaluaciones ofrece Learn-IA?">
				<p>
				Learn-IA ofrece quizzes y exámenes basados en los temas cubiertos. Además, proporciona retroalimentación y sugerencias de estudio basadas en tus resultados.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Cómo puedo monitorear mi progreso en Learn-IA?">
				<p>
				En tu perfil de usuario, podrás ver el progreso de las materias que estás estudiando, los resultados de tus evaluaciones y un calendario con fechas sugeridas para cubrir los temas y realizar evaluaciones.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Qué sucede si no puedo completar mi plan de estudio en el tiempo establecido?">
				<p>
				Learn-IA es flexible. Si no puedes completar tu plan en el tiempo definido, el sistema ajustará las fechas y te ofrecerá más tiempo para lograr tus objetivos de aprendizaje.
				</p>
			</CollapsibleSection>

			<CollapsibleSection title="¿Es Learn-IA accesible solo a través de una aplicación web?">
				<p>
				Sí, actualmente Learn-IA está disponible como una aplicación web, lo que te permite acceder a tu aprendizaje desde cualquier dispositivo con conexión a internet.
				</p>
			</CollapsibleSection>

		</div>
		
	);
}

export default ayuda;
