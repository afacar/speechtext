import Immutable from 'immutable';
import { CharacterMetadata } from 'draft-js';

import { TRANSCRIPT_SPACE } from './transcript-entities';

const updateBlock = (contentBlock, contentState) =>
  contentBlock.characterList.reduce(
    ({ characterList, text }, character, index) => {
      // Is this the first character?
      if (!characterList.isEmpty()) {
        const previousCharacter = characterList.last();
        // Does the previous character have an entity?
        if (previousCharacter.entity) {
          // Does the previous character have a different entity?
          if (character.entity) {
            const entity = contentState.getEntity(character.entity);
            const previousEntity = contentState.getEntity(previousCharacter.entity);
            // Does the different entity have the same type?
            if (entity.type === previousEntity.type && entity !== previousEntity) {
              // Merge the entities
              contentState.mergeEntityData(previousCharacter.entity, { end: entity.data.end });
              return {
                characterList: characterList.push(CharacterMetadata.applyEntity(
                  character,
                  previousCharacter.entity,
                )),
                text: text + contentBlock.text[index],
              };
            } else if (
              entity.type === TRANSCRIPT_SPACE &&
              previousEntity.type === TRANSCRIPT_SPACE
            ) {
              return {
                characterList,
                text,
              };
            }
          }
        } else {
          // Is this character a space?
          if (contentState.getEntity(character.entity).type === TRANSCRIPT_SPACE) {
            // Set previous character's entity to that of the character before it
            return {
              characterList: characterList
                .set(-1, CharacterMetadata.applyEntity(
                  previousCharacter,
                  characterList.get(-2).entity,
                ))
                .push(character),
              text: text + contentBlock.text[index],
            };
          }
          // Otherwise set previous character's entity to this character's
          return {
            characterList: characterList
              .set(-1, CharacterMetadata.applyEntity(previousCharacter, character.entity))
              .push(character),
            text: text + contentBlock.text[index],
          };
        }
      }
      return {
        characterList: characterList.push(character),
        text: text + contentBlock.text[index],
      };
    },
    { characterList: new Immutable.List(), text: '' },
  );

export default updateBlock;
