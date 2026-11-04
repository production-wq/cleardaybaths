"""Assemble the hand-authored topic drafts without calling an external model."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[3]
calendar = json.loads((root / 'data/content/calendar.json').read_text())
details = json.loads((Path(__file__).parent / 'additional-details.json').read_text())
topics = {t['row']: t for t in json.loads((Path(__file__).parent / 'topics.json').read_text())}

guides = {
 'tub': {
  'heading': 'Questions to resolve before choosing the tub',
  'paragraph': 'Ask the installer to distinguish the finished opening from the dimensions used to order the tub. Confirm the drain side, overflow arrangement, faucet location, and any access needed for servicing. If you plan to retain adjacent finishes, identify where removal might affect them. These details help prevent a modest replacement from leaving unplanned gaps around the new fixture.',
  'bullets': ['Compare interior comfort as well as exterior dimensions.', 'Identify entry and support needs before choosing basin depth.', 'Confirm removal, wall preparation, plumbing, and finishing in the estimate.'],
  'comparison': [['Conventional alcove tub', 'Everyday bathing or a tub and shower combination', 'Step-over entry and usable interior shape'], ['Deeper soaking model', 'A household that values immersion', 'Entry effort, filled weight, and hot-water needs'], ['Retained shower', 'A household that rarely uses a bathtub', 'Whether seating or layout changes better address the goal']],
  'faqs': [
   ['Can I keep the existing tub footprint?', 'Possibly, but the installer needs to verify dimensions and product requirements. A similar exterior size does not guarantee matching drains, support, or wall details.'],
   ['Should I choose the deepest tub available?', 'Choose a depth you can enter and use comfortably. Compare the interior shape and your hot-water capacity before prioritizing depth.'],
   ['Will a replacement require new walls?', 'The scope depends on the existing installation and the new product. Ask which surrounding surfaces must be removed and how the contractor will finish the transitions.'],
   ['Can I shower in the new bathtub?', 'Choose a tub and surrounding wall system intended for that use. Include the enclosure and spray containment in the design rather than adding them afterward.'],
   ['What affects the installed price?', 'Product choice, access, plumbing changes, wall work, and repairs all influence the total. Compare written proposals with the same included work.'],
   ['When can I use the finished tub?', 'Follow the installer’s written instructions for the installed materials. Some sealants and adhesives require curing before exposure to water.']
  ]
 },
 'access': {
  'heading': 'Build your consultation around specific tasks',
  'paragraph': 'Bring a short description of how you enter, turn, sit, reach, and leave the bathing area. Include any assistance or mobility equipment you use. Ask the contractor to show those movements on the proposed plan. A familiar product label does not establish that the finished room will fit your needs, and a private-home renovation should not receive an unsupported claim of universal accessibility.',
  'bullets': ['Keep the route to the bathing area clear.', 'Coordinate support locations with seating and controls.', 'Review lighting and reachable storage along with the shower or tub.'],
  'comparison': [['Lower-entry shower', 'Reducing a difficult step', 'Drainage, enclosure, and floor preparation'], ['Seated shower layout', 'Reducing standing during bathing', 'Seat support and reachable controls'], ['Walk-in bathtub', 'Preserving seated soaking', 'Door movement and the fill-and-drain routine']],
  'faqs': [
   ['Does accessible mean the same thing for everyone?', 'No, different people need different layouts and support. Describe your actual movements and any assistance you use before selecting products.'],
   ['Can support bars look coordinated with the room?', 'Many support products offer finish choices. Select a suitable product and installation method first, then coordinate its appearance with the other fixtures.'],
   ['Is a lower threshold always possible?', 'Feasibility depends on the floor, drainage, and selected shower system. Ask the installer to explain the preparation required in your specific room.'],
   ['Should I include a seat?', 'A seat can be useful when it fits your routine and the available space. Plan its support and access to controls as part of the original layout.'],
   ['Who can help evaluate complex mobility needs?', 'An occupational therapist can help translate individual needs into practical design goals. The contractor can then assess the installation and construction requirements.'],
   ['Can I make improvements in stages?', 'Some changes can stand alone, while others make sense during wall or floor work. Ask which future features need preparation now to avoid reopening finished surfaces.']
  ]
 },
 'walkin': {
  'heading': 'Compare the installed system and its operating routine',
  'paragraph': 'Request the model’s installation and operating documents before approving the order. Confirm the entry direction, seat dimensions, control locations, plumbing requirements, and any powered features. Ask how the installer will preserve service access. A clear proposal should also explain surrounding wall finishes and the plan for removing the existing fixture, so you can compare the complete project rather than a tub-only price.',
  'bullets': ['Try the door, turn, seating position, and control reach.', 'Check hot-water supply against the chosen model.', 'Compare soaking with a seated shower before committing.'],
  'comparison': [['Inward-opening door', 'A layout suited to its operating movement', 'Interior clearance and user reach'], ['Outward-opening door', 'A layout with suitable external space', 'Bathroom clearance and model-specific operation'], ['Seated shower alternative', 'A routine centered on showering', 'Seat support, entry, and spray control']],
  'faqs': [
   ['Do I enter before filling the tub?', 'That is the usual routine for conventional walk-in tubs. Follow the exact model’s instructions for filling, draining, and opening the door.'],
   ['Will my existing water heater be sufficient?', 'The installer needs to compare the tub’s requirements with your hot-water system. Do not assume every model will work equally well with the existing supply.'],
   ['Does a walk-in tub eliminate all access difficulties?', 'No, the entry, turning motion, seating position, and waiting period must suit the user. Evaluate the full routine rather than the entrance alone.'],
   ['Can the tub include jets?', 'Some models include powered bathing features. Confirm electrical, cleaning, and service-access requirements before selecting them.'],
   ['Is a walk-in tub better than a seated shower?', 'The answer depends on your preferences, movements, and available space. Compare both routines and involve an occupational therapist if your needs are complex.'],
   ['What should the installation quote include?', 'Ask for the tub model, removal, plumbing, required electrical work, surrounding finishes, and service access. Clarify how concealed damage and other changes will be handled.']
  ]
 },
 'therapy': {
  'heading': 'Compare comfort features with their upkeep',
  'paragraph': 'Ask for a demonstration or detailed operating information for the exact bathing system. Compare noise, control simplicity, adjustment options, and the recommended cleaning process. Check which components remain accessible for service after installation. A product with fewer features may suit you better if it delivers the experience you want with a routine you can maintain comfortably.',
  'bullets': ['Evaluate the seat and control reach in person when possible.', 'Confirm plumbing, power, and hot-water requirements.', 'Keep product comfort claims separate from personal medical advice.'],
  'comparison': [['Soaking tub', 'A simple immersion routine', 'Interior comfort and entry'], ['Water-jet system', 'Adjustable circulated-water sensation', 'Cleaning procedure and service access'], ['Air-bubble system', 'A different bathing sensation', 'Operating controls and model-specific maintenance']],
  'faqs': [
   ['Are therapeutic tubs a medical treatment?', 'Do not treat a bathroom product as a substitute for medical care. Discuss personal health considerations with your clinician.'],
   ['Do all jet systems work the same way?', 'No, products may use water, air, or different combinations of features. Review the exact model’s operating and care instructions.'],
   ['Will installation require electrical work?', 'Powered features may require electrical work specified by the manufacturer. Have the installer include applicable requirements in the project scope.'],
   ['How do I compare cleaning requirements?', 'Read the manufacturer’s instructions before buying. Compare both surface cleaning and any procedure for internal components or circulation.'],
   ['Can I keep the existing water heater?', 'That depends on the model and your hot-water system. Ask the installer to check compatibility rather than assume the existing setup is sufficient.'],
   ['What matters more than the number of jets?', 'Comfortable seating, accessible controls, suitable entry, and manageable care are useful priorities. Choose features you expect to use regularly.']
  ]
 },
 'shower': {
  'heading': 'Review the whole shower as one installation',
  'paragraph': 'Ask the contractor to explain how the base, walls, enclosure, drain, and controls work together. Confirm the preparation method for the selected system and how the installer handles penetrations or accessory attachments. Keep the scope specific enough to compare proposals. A lower material price is not necessarily a lower project price if removal, repairs, or finishing remain outside the estimate.',
  'bullets': ['Mark the entrance and the space needed outside it.', 'Place controls and storage within comfortable reach.', 'Review the base, joints, and enclosure care instructions.'],
  'comparison': [['Sliding enclosure', 'Keeping door movement within the shower opening', 'Usable entry width and track cleaning'], ['Hinged enclosure', 'A direct opening where clearance permits', 'Door swing and nearby fixtures'], ['Fixed-panel layout', 'A more open arrangement in a suitable footprint', 'Splash control and entrance geometry']],
  'faqs': [
   ['Can the new shower use the current footprint?', 'Often that is a useful starting point, but the installer must verify dimensions and drainage. Product requirements and concealed conditions can change the plan.'],
   ['Does a low entrance mean no floor work?', 'No, the base, slope, and drainage still need a suitable installation. Ask what preparation your proposed entrance requires.'],
   ['Should I choose the enclosure before the base?', 'Plan both together so they fit and contain water appropriately. Follow the installer’s measurement sequence before ordering custom glass.'],
   ['Can I add a seat or support bar later?', 'Some later additions are possible, but suitable backing and placement are easier to plan during the remodel. Discuss likely needs before the walls close.'],
   ['How much maintenance will the shower need?', 'Follow the selected products’ cleaning and inspection instructions. Panels, glass, joints, hardware, and drains each have their own care requirements.'],
   ['How do I compare two estimates fairly?', 'Check that both cover the same products, removal, preparation, plumbing, enclosure, and finishing. Ask each contractor to identify exclusions and allowances.']
  ]
 },
 'walls': {
  'heading': 'Ask for the installation detail, not just a sample',
  'paragraph': 'A sample shows the finish, but your contractor should also explain the substrate, joining method, corners, and connection to the tub or shower base. Confirm how the system handles accessories and plumbing openings. Keep the manufacturer’s instructions with your project records, and ask which joints need ongoing inspection. These practical details help you understand the work hidden behind the finished appearance.',
  'bullets': ['Compare physical samples under your bathroom lighting.', 'Locate shelves and fittings before wall installation.', 'Ask about cleaning restrictions and repair options.'],
  'comparison': [['Large wall panels', 'A design with fewer visible divisions', 'Panel fit and specified joint treatment'], ['Textured panel finish', 'Visual detail in a coordinated system', 'Texture cleaning and pattern alignment'], ['Tile installation', 'Flexible individual-unit layouts', 'Substrate, waterproofing, and grout care']],
  'faqs': [
   ['Can new panels cover damaged walls?', 'A new finish should not conceal an unresolved moisture or structural problem. Have the contractor assess the existing condition and the selected system’s preparation requirements.'],
   ['Are fewer seams the same as no maintenance?', 'No, the remaining joints and fittings still require appropriate care. Follow the manufacturer’s inspection and cleaning guidance.'],
   ['Can I add a niche to any wall system?', 'Compatibility depends on the products and installation details. Plan niches before ordering and ask how the opening will maintain the water-management system.'],
   ['Do all acrylic products have identical properties?', 'No, construction, finish, and installation requirements differ. Compare the documentation for the exact products you are considering.'],
   ['What cleaners should I use?', 'Use products and tools allowed by the manufacturer. Avoid assuming a cleaner suitable for the old shower is also suitable for the new surface.'],
   ['What should the estimate describe?', 'It should identify removal, preparation, panels or other finishes, joints, accessories, and surrounding transitions. Ask how the contractor will price unexpected repairs.']
  ]
 },
 'fast': {
  'heading': 'Use a written readiness checklist',
  'paragraph': 'Confirm that the crew has verified measurements, the selected products are available, and every visible finish has an approved choice. Ask who will contact you if conditions change before installation. Keep a copy of the scope and the procedure for approving additional work. A short construction window is easier to manage when the decisions that might interrupt it already have answers.',
  'bullets': ['Verify products and delivery before demolition.', 'Prepare another bathing option for the unavailable period.', 'Request written first-use and cure-time instructions.'],
  'comparison': [['Focused bathing-area replacement', 'A suitable existing layout', 'Product availability and concealed conditions'], ['Replacement with repair work', 'An area with damaged underlying materials', 'Additional preparation and revised timing'], ['Whole-room renovation', 'Broader layout or finish changes', 'Trade coordination and a larger schedule']],
  'faqs': [
   ['Does one day include measuring and ordering?', 'Usually the phrase concerns an on-site installation window. Confirm the full timeline, including preparation and product delivery, with your contractor.'],
   ['Is a one-day installation guaranteed?', 'It depends on the scope, products, access, and existing conditions. Ask what circumstances could extend your specific project.'],
   ['Can I use the shower the same evening?', 'Follow the installed materials’ first-use instructions. Some sealants and adhesives need curing after the installation work finishes.'],
   ['Should I keep the existing layout?', 'A suitable existing footprint may simplify the work. Keep it only if it also meets your practical needs.'],
   ['What if installers uncover damage?', 'Ask them to document the condition and explain the repair options. Approve the added scope and schedule in writing before work proceeds.'],
   ['How can I help installation run smoothly?', 'Finish selections, clear access, and remove personal items beforehand. Confirm the crew’s preparation checklist and maintain a backup bathing arrangement.']
  ]
 },
 'renovation': {
  'heading': 'Make the proposal easy to compare and manage',
  'paragraph': 'A useful proposal separates products, labor scope, allowances, and exclusions. Ask who coordinates deliveries and any required inspections, then confirm how changes receive approval. Keep your selections in one document rather than scattered messages. When two estimates differ, compare the included work before comparing the final total; the difference may reflect omitted preparation or a different product rather than better value.',
  'bullets': ['Identify required repairs and optional upgrades separately.', 'Keep product selections and change approvals in writing.', 'Agree on completion checks and first-use instructions.'],
  'comparison': [['Focused fixture replacement', 'A specific worn or inconvenient bathing area', 'Compatibility with retained surfaces'], ['Coordinated finish renovation', 'A broader appearance and usability update', 'Product decisions and trade sequencing'], ['Layout reconfiguration', 'A room whose arrangement no longer works', 'Plumbing, structure, permits, and expanded scope']],
  'faqs': [
   ['Where should I start planning?', 'Document what does not work in the current bathroom and what you want to retain. Use those priorities to define the project scope before choosing finishes.'],
   ['Should I move the fixtures?', 'Move them when the improved layout justifies the added work. Ask the contractor to explain the plumbing and construction implications before deciding.'],
   ['Do all renovations need the same permits?', 'Requirements depend on location and project scope. Ask who will verify and handle the requirements that apply to your work.'],
   ['How do I avoid surprise costs?', 'Clarify allowances, exclusions, and the process for concealed conditions. Require written approval for changes affecting price or schedule.'],
   ['Can I remain at home during the project?', 'That depends on access, work conditions, and available bathroom facilities. Agree on a practical household plan with the contractor before work begins.'],
   ['What should I receive at completion?', 'Request care instructions, product details, applicable written warranties, and a record of any remaining work. Confirm when the bathing area is ready for use.']
  ]
 }
}

def group(service):
 s=service.lower()
 if s=='walk-in bathtubs': return 'walkin'
 if s=='therapeutic tubs': return 'therapy'
 if s=='accessible bathroom': return 'access'
 if s in ['replacement bathtubs','shower to tub conversions']: return 'tub'
 if s=='one-day bath': return 'fast'
 if s in ['bath surrounds','shower surrounds','acrylic showers']: return 'walls'
 if s in ['bathroom installation','bathroom remodeling','bath renovation']: return 'renovation'
 return 'shower'

palettes=['warm ivory panels, pale oak vanity and brushed nickel fixtures', 'soft limestone-colored walls, muted sage cabinetry and chrome fixtures', 'white marble-look panels with subtle gray veining and brushed brass accents', 'cream wall panels, walnut cabinetry and brushed nickel hardware']
out=root/'data/content/articles';out.mkdir(parents=True,exist_ok=True)
for row in calendar:
 if row['existing']: continue
 t=topics[row['sourceRow']]; g=guides[group(row['service'])]
 sections=[{'heading':h,'paragraphs':[p1,p2],'bullets':[]} for h,p1,p2 in t['focus']]
 sections[0]['bullets']=g['bullets']
 if str(row['sourceRow']) in details: sections[2]['paragraphs'].append(details[str(row['sourceRow'])])
 sections.append({'heading':g['heading'],'paragraphs':[g['paragraph']],'bullets':[]})
 sections.append({'heading':'Bring a clear brief to your consultation','paragraphs':[f"For your {row['location'].replace('Capital Heights','Capitol Heights')} project, bring photographs of the existing room, a list of the problems you want to solve, and examples of finishes you like. Ask Clear Day Bath Solutions to review the proposed scope against the room’s actual conditions. Explain any timing constraints and which other bathroom facilities you can use while work takes place.", 'Before approving an order, check that the proposal reflects your selections and practical priorities. Ask for clarification wherever a product, preparation step, or finishing detail remains unspecified. Keep the final scope and any later changes together so the installation team and your household work from the same plan.'],'bullets':['Confirm included work and exclusions.','Ask about product availability and first use.','Keep the installation and care documents.']})
 concept={'tub':'a built-in alcove bathtub with a three-wall surround','access':'a generous low-threshold shower with a wall-mounted seat, correctly anchored grab bars and reachable hand shower','walkin':'a built-in walk-in bathtub with a visible watertight side door and integrated seat','therapy':'a built-in alcove soaking tub with discreet jets and an accessible service panel','shower':'a practical enclosed shower with clear glass and a low curb','walls':'a shower alcove highlighting neatly joined large-format wall panels','fast':'a clean compact bathroom with a built-in shower alcove','renovation':'a coordinated residential bathroom with a built-in tub and shower combination'}[group(row['service'])]
 article={'intro':t['intro'],'sections':sections,'comparison':{'caption':f"Planning options: {row['service'].lower()}",'headers':['Option','Potential fit','What to verify'],'rows':g['comparison']},'cta':f"Discuss your plans for {row['service'].lower()} with Clear Day Bath Solutions and ask for a scope that fits your home and routine.",'faqs':[{'question':q,'answer':a} for q,a in g['faqs']], 'seoDesc':f"Plan {row['service'].lower()} in {row['location'].replace('Capital Heights','Capitol Heights')} with practical guidance on layout, installation, care, and questions for your consultation.", 'excerpt':t['intro'].split('. ')[0]+'.', 'imagePrompt':f"Architectural editorial photograph concept of {concept}, {palettes[row['sourceRow']%4]}, realistic fixtures, bright diffuse daylight, uncluttered, no people. Eye-level wide three-quarter composition with physically plausible plumbing and door clearances. {row['imageConstraints']}", 'imageAlt':f"Design concept showing {concept}"}
 (out/f"{row['slug']}.json").write_text(json.dumps(article,indent=2,ensure_ascii=False)+'\n')
print('Saved 32 hand-authored articles; no existing posts changed.')
